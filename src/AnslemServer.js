/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemServerConfig, gameloop, compileGoals, NodeServer, Player, Sprites, Universe
 */
var AnslemServerConfig = require('./AnslemServerConfig');
var gameloop = require('node-gameloop');
var Goals = require('./universe/compileGoals');
var NodeServer = require("./lib/NodeServer");
var Player = require("./universe/Player");
var Sprites = require("./universe/Sprites");
var Universe = require("./universe/Universe");

/**
 * Anslem game server wrapper
 *
 * @class AnslemServer
 * @constructor
 * @extends NodeServer
 */
function AnslemServer() {
    NodeServer.call(this);
    var self = this;
    /**
     * Last calculated fps
     *
     * @property currentFps
     * @type {Number}
     */
    this.currentFps = AnslemServerConfig.serverFps;

    /**
     * Is the server running
     *
     * @property running
     * @type {Boolean}
     */
    this.running = false;

    /**
     * Universe instance
     *
     * @property universe
     * @type {Universe}
     */
    this.universe = new Universe();

    /**
     * Client connected callback
     *
     * @method clientConnected
     * @param {Object} client
     * @return {Object} initial data to send to client
     */
    this.clientConnectCallback = function (client) {
        client.player = new Player();
        client.player.load(client, this.universe);

        var initialData = {message: 'Welcome to Anslem!', assets: {sprites: Sprites}, viewScale: client.player.view.scale};
        return initialData;
    };

    /**
     * Client disconnected callback
     *
     * @method clientDisconnected
     * @param {Object} client
     */
    this.clientDisconnectCallback = function (client) {
        console.log("Client disconnected");
        client.player.destroy();
    };

    /**
     * Client info recieved callback
     *
     * @method clientInfoRecieved
     * @param {Object} client
     * @param {Object} info
     */
    this.clientInfoCallback = function (client, info) {
        client.player.initializeView(info.screenWidth, info.screenHeight);
    };

    /**
     * Log general server info on an interval
     *
     * @method logServerInfo
     */
    AnslemServer.prototype.logServerInfo = function () {
        console.log("Server FPS: " + this.currentFps);
        console.log(Object.keys(this.clients).length + " player(s) currently connected");
        if (this.running)
            setTimeout(function () {
                self.logServerInfo.call(self);
            }, AnslemServerConfig.serverInfoInterval);
    };

    /**
     * Start the server
     *
     * @method start
     */
    AnslemServer.prototype.start = function () {
        NodeServer.prototype.start.call(this, AnslemServerConfig.port);

        this.running = true;
        this.universe.populate();

        this.gameloopId = gameloop.setGameLoop(function (delta) {
            self.update.call(self, delta);
        }, 1000 / AnslemServerConfig.serverFps);
        this.logServerInfo();
    };

    /**
     * Stop the server
     *
     * @method stop
     */
    AnslemServer.prototype.stop = function () {
        this.running = false;
        delete this.universe;
        this.universe = new Universe();
        gameloop.clearGameLoop(this.gameloopId);
    };

    /**
     * Run single frame
     *
     * @method update
     * @param {Number} delta time since last update
     */
    AnslemServer.prototype.update = function (delta) {
        this.currentFps = 1 / delta;
        this.universe.run();
        for (var id in this.clients) {
            var player = this.clients[id].player;
            if (player) {
                var packet = player.container.getPacket();
                packet.viewX = player.view.x;
                packet.viewY = player.view.y;
//                packet.contents.sort(function (a, b) {
//                    return a.z > b.z;
//                });
                this.updateClient(id, packet);
            }
        }
    };
}
AnslemServer.prototype = new NodeServer();
AnslemServer.prototype.constructor = AnslemServer;

module.exports = AnslemServer;
