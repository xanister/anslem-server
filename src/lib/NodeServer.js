/**
 * Node live data server
 *
 * Author: Nicholas Frees
 * Date: 09/06/2014
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
 */
function NodeServer() {
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
     * @default 3000
     */
    this.port = 3000;

    /**
     * On new client connect, return initial data to send to client
     *
     * @event clientConnectCallback
     * @param {Object} client
     * @return {Object} Return initial data to send to client
     */
    this.clientConnectCallback = function (client) {
        this.log("Client has connected", client);
        return {};
    };

    /**
     * On client disconnect callback
     *
     * @event clientDisconnectCallback
     * @param {Number} clientId
     */
    this.clientDisconnectCallback = function (clientId) {
        this.log("Client has disconnected", clientId);
    };

    /**
     * Client updated info callback
     *
     * @event clientInfoCallback
     */
    this.clientInfoCallback = false;

    /**
     * On client input callback
     *
     * @event clientInputCallback
     */
    this.clientInputCallback = false;

    /**
     * Send message to all connected clients
     *
     * @method broadcast
     * @param {String} message
     */
    NodeServer.prototype.broadcast = function (message) {
        socket.sockets.emit("message", message);
    };

    /**
     * Generate empty client input event object
     *
     * @method getEmptyInputEvents
     * @return {Object}
     */
    NodeServer.prototype.getEmptyInputEvents = function () {
        return {
            keydown: {},
            keyup: {},
            message: false,
            swipe: {},
            touchstart: false,
            touchend: false
        };
    };

    /**
     * Get current server time
     *
     * @method getTime
     * @return {Date}
     */
    NodeServer.prototype.getTime = function () {
        return new Date();
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
     * Send message to specific connected client
     *
     * @method message
     * @param {String} clientId
     * @param {String} message
     */
    NodeServer.prototype.message = function (clientId, message) {
        if (this.clients[clientId])
            this.clients[clientId].emit("message", message);
    };

    /**
     * Start server
     *
     * @method start
     * @param {Function} clientConnectCallback
     * @param {Function} clientDisconnectCallback
     */
    NodeServer.prototype.start = function (clientConnectCallback, clientDisconnectCallback) {
        // Open connection
        this.clientConnectCallback = clientConnectCallback || this.clientConnectCallback;
        this.clientDisconnectCallback = clientDisconnectCallback || this.clientDisconnectCallback;
        socket = IO.listen(this.port);

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
            var initialData = nodeServer.clientConnectCallback ? nodeServer.clientConnectCallback.call(nodeServer, client) : {};

            // Send initial data to client
            client.emit('connection', {message: 'welcome', clientId: client.id, initialData: initialData});

            // Accept input
            client.on("clientInput", function (inputs) {
                nodeServer.clients[client.id].inputs.keyboard = inputs.keyboard;
                nodeServer.clients[client.id].inputs.touches = inputs.touches;
                nodeServer.clients[client.id].inputs.events = inputs.events;
                if (nodeServer.clientInputCallback)
                    nodeServer.clientInputCallback.call(nodeServer, client.id, inputs);
            });

            // Accept client info
            client.on("clientInfo", function (info) {
                for (var index in info) {
                    nodeServer.clients[client.id].info[index] = info[index];
                }
                if (nodeServer.clientInfoCallback)
                    nodeServer.clientInfoCallback.call(nodeServer, client.id, info);
            });

            // Update on disconnect
            client.on("disconnect", function () {
                delete nodeServer.clients[client.id];
                if (nodeServer.clientDisconnectCallback)
                    nodeServer.clientDisconnectCallback.call(nodeServer, client.id);
            });
        });
    };

    /**
     * Sync data to client
     *
     * @method update
     * @param {Object} clientId
     * @param {Object} packet
     */
    NodeServer.prototype.update = function (clientId, packet) {
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