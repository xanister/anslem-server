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
IO = require('socket.io');

/**
 * NodeServer
 * @param {function} clientConnectCallback
 * @param {function} clientDisconnectCallback
 * @param {function} clientInfoCallback
 * @param {function} clientInputCallback
 * @returns {NodeServer}
 */
function NodeServer(clientConnectCallback, clientDisconnectCallback, clientInfoCallback, clientInputCallback) {
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
     * On client connect callback
     * @access public
     * @var {function}
     */
    this.clientConnectCallback = clientConnectCallback || false;

    /**
     * On client disconnect callback
     * @access public
     * @var {function}
     */
    this.clientDisconnectCallback = clientDisconnectCallback || false;

    /**
     * Client updated info callback
     * @access public
     * @var {function}
     */
    this.clientInfoCallback = clientInfoCallback || false;

    /**
     * On client input callback
     * @access public
     * @var {function}
     */
    this.clientInputCallback = clientInputCallback || false;

    /**
     * Send message to all connected clients
     * @param {String} message
     */
    this.broadcast = function (message) {
        socket.sockets.emit("message", {time: this.getTime(), message: message});
    };

    /**
     * Get current server time
     * @returns {Date}
     */
    this.getTime = function () {
        return new Date();
    };

    /**
     * Log out to server
     * @param {String} message
     */
    this.log = function (message) {
        console.log(message);
    };

    /**
     * Send message to specific connected client
     * @param {String} clientId
     * @param {String} message
     */
    this.message = function (clientId, message) {
        if (this.clients[clientId])
            this.clients[clientId].emit("message", {time: this.getTime(), message: message});
    };

    /**
     * Start server
     * @param {Number} port
     */
    this.start = function (port) {
        socket = IO.listen(port || 3000);

        // Listen for connections and bind events per client
        var nodeServer = this;
        socket.on('connection', function (client) {
            console.log("Client[" + client.id + "] connected");

            // Save client
            nodeServer.clients[client.id] = client;
            nodeServer.clients[client.id].inputs = {};

            // Send connection success to client
            client.emit('connection', {result: 'success', id: client.id});

            // Callback
            if (nodeServer.clientConnectCallback)
                nodeServer.clientConnectCallback({id: client.id});

            // Accept input
            client.on("clientInput", function (inputs) {
                nodeServer.clients[client.id].inputs = inputs;
                if (nodeServer.clientInputCallback)
                    nodeServer.clientInputCallback({id: client.id, inputs: inputs});
            });

            // Accept client info
            client.on("clientInfo", function (info) {
                nodeServer.clients[client.id].info = info;
                if (nodeServer.clientInfoCallback)
                    nodeServer.clientInfoCallback(client.id, info);
            });

            // Update on disconnect
            client.on("disconnect", function () {
                console.log("Client[" + client.id + "] disconnected");
                delete nodeServer.clients[client.id];
                if (nodeServer.clientDisconnectCallback)
                    nodeServer.clientDisconnectCallback({id: client.id});
            });
        });
    };

    /**
     * Sync data to all connected clients
     * @param {Object} data
     * @param {Object} clientId
     */
    this.update = function (data, clientId) {
        if (this.clients[clientId])
            this.clients[clientId].emit("update", {time: this.getTime(), data: data});
    };

    /**
     * Send initial data to client
     * @param {String} clientId
     * @param {Object} data
     */
    this.welcome = function (clientId, data) {
        this.clients[clientId].emit("welcome", data);
    };
}

module.exports = NodeServer;