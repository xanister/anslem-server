/**
 * NodeServer.js
 * Basic live data server
 *
 * Author: Nicholas Frees
 * Date: 09/06/2014
 */

/**
 * Includes
 */
var IO = require('socket.io');

/**
 * NodeServer
 * @param {Number} port
 * @returns {NodeServer}
 */
function NodeServer(port) {
    /**
     * IO socket
     * @access private
     * @var {Object}
     */
    var socket;

    /**
     * Connected clients
     * @access public
     * @var {Object}
     */
    this.clients = {};

    /**
     * Port to listen on
     * @access public
     * @var {Number}
     */
    this.port = port || 3000;

    /**
     * On new client connect, return initial data to send to client
     * @access public
     * @param {Object} client
     * @returns {Object}
     */
    this.clientConnectCallback = function (client) {
        this.log("Client has connected", client);
        return {};
    };

    /**
     * On client disconnect callback
     * @access public
     * @param {Number} clientId
     */
    this.clientDisconnectCallback = function (clientId) {
        this.log("Client has disconnected", clientId);
    };

    /**
     * Client updated info callback
     * @access public
     * @var {function}
     */
    this.clientInfoCallback = false;

    /**
     * On client input callback
     * @access public
     * @var {function}
     */
    this.clientInputCallback = false;

    /**
     * Send message to all connected clients
     * @param {String} message
     */
    NodeServer.prototype.broadcast = function (message) {
        socket.sockets.emit("message", message);
    };

    /**
     * Get current server time
     * @returns {Date}
     */
    NodeServer.prototype.getTime = function () {
        return new Date();
    };

    /**
     * Log out to server
     * @param {String} message
     */
    NodeServer.prototype.log = function (message) {
        console.log(message);
    };

    /**
     * Send message to specific connected client
     * @param {String} clientId
     * @param {String} message
     */
    NodeServer.prototype.message = function (clientId, message) {
        if (this.clients[clientId])
            this.clients[clientId].emit("message", message);
    };

    /**
     * Start server
     * @param {function} clientConnectCallback
     * @param {function} clientDisconnectCallback
     */
    NodeServer.prototype.start = function (clientConnectCallback, clientDisconnectCallback) {
        // Open connection
        this.clientConnectCallback = clientConnectCallback || this.clientConnectCallback;
        this.clientDisconnectCallback = clientDisconnectCallback || this.clientDisconnectCallback;
        socket = IO.listen(this.port);

        // Bind events
        var nodeServer = this;

        /**
         *  Listen for connections and bind events per client
         *  @param {Object} client
         */
        socket.on('connection', function (client) {
            // Save client
            nodeServer.clients[client.id] = client;
            nodeServer.clients[client.id].info = {};
            nodeServer.clients[client.id].inputs = {keyboard: {}, touches: {}};

            // Server Callback
            var initialData = nodeServer.clientConnectCallback ? nodeServer.clientConnectCallback.call(nodeServer, client) : {};

            // Send initial data to client
            client.emit('connection', {message: 'welcome', clientId: client.id, initialData: initialData});

            // Accept input
            client.on("clientInput", function (inputs) {
                nodeServer.clients[client.id].inputs.keyboard = inputs.keyboard;
                nodeServer.clients[client.id].inputs.touches = inputs.touches;
                if (nodeServer.clientInputCallback)
                    nodeServer.clientInputCallback.call(nodeServer, client.id, inputs);
            });

            // Accept client info
            client.on("clientInfo", function (info) {
                nodeServer.clients[client.id].info = info;
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
     * @param {Object} clientId
     * @param {Object} packet
     */
    NodeServer.prototype.update = function (clientId, packet) {
        if (this.clients[clientId])
            this.clients[clientId].emit("update", {packet: packet});
    };

    /**
     * Sync data to all clients
     * @param {Object} packet
     */
    NodeServer.prototype.updateAll = function (packet) {
        socket.sockets.emit("update", {packet: packet});
    };
}

module.exports = NodeServer;