/**
 * Node live data server
 *
 * @module NodeServer
 * @requires socket.io
 */
var IO = require('socket.io');

/**
 * NodeServer
 *
 * @class NodeServer
 * @constructor
 * @param {Number} [port=3010]
 */
function NodeServer(port) {
    /**
     * IO socket
     *
     * @property socket
     * @type {Object}
     * @private
     */
    var socket;

    /**
     * Clear client input events on update
     *
     * @property clearEventsOnUpdate
     * @type {Boolean}
     */
    this.clearEventsOnUpdate = true;

    /**
     * Connected clients
     *
     * @property clients
     * @protected
     * @type {Object}
     */
    this.clients = {};

    /**
     * Port to listen on
     *
     * @property port
     * @protected
     * @type {Number}
     * @default 3010
     */
    this.port = port || 3010;

    /**
     * On new client connect, return initial data to send to client
     *
     * @event onclientconnect
     * @param {Object} client
     * @return {Object} Return initial data to send to client
     */
    this.onclientconnect = false;

    /**
     * On client disconnect callback
     *
     * @event onclientdisconnect
     * @param {Object} client
     */
    this.onclientdisconnect = false;

    /**
     * Client updated info callback
     *
     * @event onclientinfo
     * @param {Object} client
     * @param {Object} info
     */
    this.onclientinfo = false;

    /**
     * On client input callback
     *
     * @event onclientinput
     * @param {Object} client
     * @param {Object} input
     */
    this.onclientinput = false;

    /**
     * On client input callback
     *
     * @event onclientstatechange
     * @param {Object} client
     * @param {String} state
     */
    this.onclientstatechange = false;

    /**
     * Bind events
     *
     * @method bindEvents
     */
    this.bindEvents = function () {
        // Listen for connections and bind events per client
        var nodeServer = this;
        socket.on('connection', function (client) {
            // Save client
            var screenSize = client.handshake.query.screenSize.split(',');
            nodeServer.clients[client.id] = client;
            nodeServer.clients[client.id].info = {screenWidth: screenSize[0], screenHeight: screenSize[1]};
            nodeServer.clients[client.id].inputs = {keyboard: {}, touches: {}, events: {}};
            nodeServer.clients[client.id].latency = 0;
            nodeServer.clients[client.id].lastUpdateTime = Date.now();
            nodeServer.clients[client.id].state = "connected";

            // Server Callback
            var initialData = nodeServer.onclientconnect ? nodeServer.onclientconnect.call(nodeServer, client) : {};

            // Send initial data to client
            client.emit('connection', {message: 'welcome', clientId: client.id, initialData: initialData});

            // Accept input
            client.on("clientInput", function (inputs) {
                if (client.state !== "ready")
                    return false;
                nodeServer.clients[client.id].inputs.keyboard = inputs.keyboard;
                nodeServer.clients[client.id].inputs.touches = inputs.touches;
                nodeServer.clients[client.id].inputs.events = inputs.events;
                nodeServer.clients[client.id].inputs.message = inputs.message || nodeServer.clients[client.id].inputs.message;
                if (nodeServer.onclientinput)
                    nodeServer.onclientinput.call(nodeServer, client, inputs);
            });

            // Accept client info
            client.on("clientInfo", function (info) {
                for (var index in info)
                    nodeServer.clients[client.id].info[index] = info[index];
                if (nodeServer.onclientinfo)
                    nodeServer.onclientinfo.call(nodeServer, client, info);
            });

            // Update on state change
            client.on("clientStateChange", function (state) {
                client.state = state;
                if (nodeServer.onclientstatechange)
                    nodeServer.onclientstatechange.call(nodeServer, client, state);
            });

            // Update on disconnect
            client.on("disconnect", function () {
                if (nodeServer.onclientdisconnect)
                    nodeServer.onclientdisconnect.call(nodeServer, client);
                delete nodeServer.clients[client.id];
            });

            // Response to updates for latency checks
            client.on("updateResponse", function () {
                client.latency = Date.now() - client.lastUpdateTime;
            });
        });
    };

    /**
     * Send event to all connected clients
     *
     * @method broadcast
     * @param {String} eventName
     * @param {Object} packet
     */
    NodeServer.prototype.broadcast = function (eventName, packet) {
        socket.sockets.emit(eventName, packet);
    };

    /**
     * Log out to server
     *
     * @method log
     * @param {String} message
     */
    NodeServer.prototype.log = function (message) {
        console.log(message);
    };

    /**
     * Listen for event
     *
     * @method on
     * @param {String} eventName
     * @param {Function} callback
     */
    NodeServer.prototype.on = function (eventName, callback) {
        socket.on(eventName, callback);
    };

    /**
     * Start server
     *
     * @method start
     */
    NodeServer.prototype.start = function () {
        socket = IO.listen(this.port);
        this.bindEvents();
    };

    /**
     * Send event to client
     *
     * @method emit
     * @param {String} eventName
     * @param {Object} clientId
     * @param {Object} packet
     */
    NodeServer.prototype.trigger = function (eventName, clientId, packet) {
        if (this.clients[clientId])
            this.clients[clientId].emit(eventName, packet);
    };

    /**
     * Sync data to client
     *
     * @method updateClient
     * @param {Object} clientId
     * @param {Object} packet
     */
    NodeServer.prototype.updateClient = function (clientId, packet) {
        if (this.clients[clientId]) {
            if (this.clearEventsOnUpdate)
                this.clients[clientId].inputs.events = {};
            this.clients[clientId].emit("update", {packet: packet});
            this.clients[clientId].lastUpdateTime = Date.now();
        }
    };

    /**
     * Sync data to all clients
     *
     * @method updateAll
     * @param {Object} packet
     */
    NodeServer.prototype.updateAll = function (packet) {
        socket.sockets.emit("update", {packet: packet});
    };
}

module.exports = NodeServer;
