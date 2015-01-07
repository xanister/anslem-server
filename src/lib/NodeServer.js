/**
 * Node live data server
 *
 * @module NodeServer
 * @requires socket.io
 */
var IO = require('socket.io');

/**
 * Client object
 *
 * @class Client
 * @constructor
 */
function Client() {
    /**
     * Client information, ie screen size, pixel density, etc
     *
     * @property info
     * @type {Object}
     */
    this.info = {};

    /**
     * Client inputs. Includes keyboard, touches and events
     *
     * @property inputs
     * @type {Object}
     */
    this.inputs = {keyboard: {}, touches: {}, events: {}};

    /**
     * Last measured latency
     *
     * @property latency
     * @type {Number}
     */
    this.latency = 0;

    /**
     * Start ping time
     *
     * @property pingStart
     * @type {Number}
     * @protected
     */
    this.pingStart = 0;

    /**
     * Current client state
     *
     * @property state
     * @type {String}
     */
    this.state = "connected";

    /**
     * On new client connect, return initial data to send to client
     *
     * @event onconnect
     */
    this.onconnect = false;

    /**
     * Client updated info callback
     *
     * @event oninfo
     * @param {Object} info
     */
    this.oninfo = false;

    /**
     * On client input callback
     *
     * @event oninput
     * @param {Object} input
     */
    this.oninput = false;

    /**
     * On client input callback
     *
     * @event onstatechange
     * @param {String} state
     */
    this.onstatechange = false;

    /**
     * Ping client to measure latency
     *
     * @method ping
     * @protected
     */
    this.ping = function () {
        this.pingStart = Date.now();
        this.trigger("ping");
    };

    /**
     * Trigger event to client
     *
     * @method trigger
     * @param {String} eventName
     * @param {Object} [packet]
     */
    this.trigger = function (eventName, packet) {
        this.emit(eventName, packet);
    };

    /**
     * Recieved client info update
     *
     * @event info
     * @param {Object} info
     * @protected
     */
    this.on("info", function (info) {
        for (var index in info)
            this.info[index] = info[index];
        if (this.oninfo)
            this.oninfo(info);
    });

    /**
     * Recieved client input update
     *
     * @event input
     * @param {Object} input
     * @protected
     */
    this.on("input", function (inputs) {
        this.inputs.keyboard = inputs.keyboard;
        this.inputs.touches = inputs.touches;
        this.inputs.events = inputs.events;
        if (this.oninput)
            this.oninput(inputs);
    });

    /**
     * Recieved client state change update
     *
     * @event stateChange
     * @param {Object} state
     * @protected
     */
    this.on("stateChange", function (state) {
        this.state = state;
        if (this.onstatechange)
            this.onstatechange(state);
    });

    /**
     * Client disconnected
     *
     * @event disconnect
     * @protected
     */
    this.on("disconnect", function () {
        if (this.ondisconnect)
            this.ondisconnect();
    });

    /**
     * Recieved response from ping
     *
     * @event pong
     * @protected
     */
    this.on("pong", function () {
        this.latency = Date.now() - this.pingStart;
    });

    /**
     * Emit connection event on new client
     */
    this.emit('connection', {message: 'welcome'});
}

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
     * @private
     * @type {Object}
     */
    var socket;

    /**
     * Connected clients
     *
     * @property clients
     * @type {Object}
     */
    this.clients = {};

    /**
     * On new client connect, return initial data to send to client
     *
     * @event onclientconnect
     */
    this.onclientconnect = false;

    /**
     * On client disconnect callback
     *
     * @event onclientdisconnect
     */
    this.onclientdisconnect = false;

    /**
     * Port to listen on
     *
     * @property port
     * @type {Number}
     * @default 3010
     */
    this.port = port || 3010;

    /**
     * Log out to server
     *
     * @method log
     * @param {String} message
     * @param {String} [logType=info]
     */
    NodeServer.prototype.log = function (message, logType) {
        console.log("[" + (logType || "info") + "] " + message);
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
        var self = this;
        socket.on('connection', function (client) {
            Client.call(client);
            self.clients[client.id] = client;
            if (self.onclientconnect)
                self.onclientconnect(client);
            client.on("disconnect", function () {
                delete self.clients[client.id];
                if (self.onclientdisconnect)
                    self.onclientdisconnect(client);
            });
        });
    };

    /**
     * Send event to all connected clients
     *
     * @method trigger
     * @param {String} eventName
     * @param {Object} [packet]
     */
    NodeServer.prototype.trigger = function (eventName, packet) {
        socket.sockets.emit(eventName, packet);
    };
}

module.exports = NodeServer;
