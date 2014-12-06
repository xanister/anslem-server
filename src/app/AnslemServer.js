/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemServerConfig, gameloop, compileGoals, NodeServer, Player, Sprites, Universe
 */
var AnslemServerConfig = require('./AnslemServerConfig');
var gameloop = require('node-gameloop');
var NodeServer = require("../lib/NodeServer");
var Player = require("../universe/Player");
var Sprites = require("../universe/Sprites");
var Universe = require("../universe/Universe");

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
        this.trigger("assetUpdate", client.id, {sprites: Sprites, sounds: {}});
        return {message: 'Welcome to Anslem!'};
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
        console.log("Client info recieved");
        client.player.initializeView(client.info.screenWidth, client.info.screenHeight);
        this.trigger("viewUpdate", client.id, {width: client.player.view.width, height: client.player.view.height});
    };

    /**
     * Client state changed update
     *
     * @param {Object} client
     * @param {String} state
     */
    this.onclientstatechange = function (client, state) {
        console.log("Client state change recieved. " + client.player.id + " is " + state);
        if (state === "ready") {
            //client.player.load(client, this.universe);
        }
    };

    /**
     * Run single frame
     *
     * @method update
     * @private
     * @param {Number} delta time since last update
     */
    this.update = function (delta) {
        this.currentFps = 1 / delta;
        this.universe.run();
        for (var id in this.clients) {
            var player = this.clients[id].player;
            if (player)
                this.updateClient(id, player.getPacket(true));
        }
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
     * Start the server
     *
     * @method start
     */
    AnslemServer.prototype.start = function () {
        NodeServer.prototype.start.call(this);
	require('../universe/compileCelia');
        this.running = true;
        var self = this;
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
        gameloop.clearGameLoop(this.gameloopId);
    };
}
AnslemServer.prototype = new NodeServer();
AnslemServer.prototype.constructor = AnslemServer;

module.exports = AnslemServer;
