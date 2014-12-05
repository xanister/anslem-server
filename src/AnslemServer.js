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
    NodeServer.call(this, AnslemServerConfig.port);
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
     * Run single frame
     *
     * @method update
     * @private
     * @param {Number} delta time since last update
     */
    function update(delta) {
        this.currentFps = 1 / delta;
        this.universe.run();
        for (var id in this.clients) {
            var player = this.clients[id].player;
            if (player)
                this.updateClient(id, player.getPacket(true));
        }
    }

    /**
     * Client connected callback
     *
     * @method onclientconnect
     * @param {Object} client
     * @return {Object} initial data to send to client
     */
    this.onclientconnect = function (client) {
        console.log("Client connected");
        client.player = new Player();
        client.player.load(client, this.universe);
        this.sendAssetUpdate(client.id);
        return {message: 'Welcome to Anslem!', viewScale: client.player.view.scale};
    };

    /**
     * Client disconnected callback
     *
     * @method onclientdisconnect
     * @param {Object} client
     */
    this.onclientdisconnect = function (client) {
        console.log("Client disconnected");
        client.player.destroy();
    };

    /**
     * Client info recieved callback
     *
     * @method onclientinfo
     * @param {Object} client
     * @param {Object} info
     */
    this.onclientinfo = function (client, info) {
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
        if (this.running) {
            var self = this;
            setTimeout(function () {
                self.logServerInfo.call(self);
            }, AnslemServerConfig.serverInfoInterval);
        }
    };

    /**
     * Sends asset update event to client
     *
     * @method sendAssetUpdate
     * @param {String} clientId
     */
    AnslemServer.prototype.sendAssetUpdate = function (clientId) {
        this.trigger(clientId, "assetUpdate", {sprites: Sprites, sounds: {}});
    };

    /**
     * Start the server
     *
     * @method start
     */
    AnslemServer.prototype.start = function () {
        NodeServer.prototype.start.call(this);
        this.running = true;
        var self = this;
        this.gameloopId = gameloop.setGameLoop(function (delta) {
            update.call(self, delta);
        }, Math.floor(1000 / AnslemServerConfig.serverFps));
        this.logServerInfo();
    };

    /**
     * Stop the server
     *
     * @method stop
     */
    AnslemServer.prototype.stop = function () {
        this.running = false;
        gameloop.clearGameLoop(this.gameloopId);
    };
}
AnslemServer.prototype = new NodeServer();
AnslemServer.prototype.constructor = AnslemServer;

module.exports = AnslemServer;
