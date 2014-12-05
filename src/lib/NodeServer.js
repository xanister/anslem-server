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
     * @param {Object} info
     */
    this.onclientinfo = false;

    /**
     * On client input callback
     *
     * @event onclientinput
     * @param {Object} input
     */
    this.onclientinput = false;

    /**
     * Bind events
     *
     * @method bindEvents
     */
    this.bindEvents = function () {
        // Bind events
        var nodeServer = this;

        // Listen for connections and bind events per client
        socket.on('connection', function (client) {
            // Save client
            var screenSize = client.handshake.query.screenSize.split(',');
            nodeServer.clients[client.id] = client;
            nodeServer.clients[client.id].info = {screenWidth: screenSize[0], screenHeight: screenSize[1]};
            nodeServer.clients[client.id].inputs = {keyboard: {}, touches: {}, events: nodeServer.getEmptyInputEvents()};

            // Server Callback
            var initialData = nodeServer.onclientconnect ? nodeServer.onclientconnect.call(nodeServer, client) : {};

            // Send initial data to client
            client.emit('connection', {message: 'welcome', clientId: client.id, initialData: initialData});

            // Accept input
            client.on("clientInput", function (inputs) {
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

            // Update on disconnect
            client.on("disconnect", function () {
                if (nodeServer.onclientdisconnect)
                    nodeServer.onclientdisconnect.call(nodeServer, client);
                delete nodeServer.clients[client.id];
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
     * Generate empty client input event object
     *
     * @method getEmptyInputEvents
     * @return {Object}
     */
    NodeServer.prototype.getEmptyInputEvents = function () {
        return {
            doubletap: false,
            keydown: {},
            keyup: {},
            touchstart: false,
            touchend: false
        };
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
        // Open connection
        socket = IO.listen(this.port);
        this.bindEvents();
    };

    /**
     * Send event to client
     *
     * @method emit
     * @param {Object} clientId
     * @param {String} eventName
     * @param {Object} packet
     */
    NodeServer.prototype.trigger = function (clientId, eventName, packet) {
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
            this.clients[clientId].emit("update", {packet: packet});
        }
        if (this.clients[clientId]) {
            this.clients[clientId].inputs.events = this.getEmptyInputEvents();
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
