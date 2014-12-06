/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemServerConfig, compileCelia, gameloop, NodeServer, Player, Sprites, Universe
 */
var AnslemServerConfig = require('./AnslemServerConfig');
var Goals = require('../universe/compileCelia');
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
     * Clear client input events on update
     *
     * @property clearEventsOnUpdate
     * @type {Boolean}
     */
    this.clearEventsOnUpdate = false;

    /**
     * Last calculated network fps
     *
     * @property networkFps
     * @type {Number}
     */
    this.networkFps = AnslemServerConfig.networkFps;

    /**
     * Universe instance
     *
     * @property universe
     * @type {Universe}
     */
    this.universe = new Universe();

    /**
     * Last calculated universe fps
     *
     * @property universeFps
     * @type {Number}
     */
    this.universeFps = AnslemServerConfig.universeFps;

    /**
     * Client connected callback
     *
     * @method onclientconnect
     * @param {Object} client
     * @return {Object} initial data to send to client
     */
    this.onclientconnect = function (client) {
        this.log("Client connected");
        client.player = new Player();
        return {message: 'Welcome to Anslem!'};
    };

    /**
     * Client disconnected callback
     *
     * @method onclientdisconnect
     * @param {Object} client
     */
    this.onclientdisconnect = function (client) {
        this.log("Client disconnected");
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
        this.log("Client info recieved");
        client.player.initializeView(client.info.screenWidth, client.info.screenHeight);
        this.trigger("viewUpdate", client.id, {width: client.player.view.width, height: client.player.view.height});
    };

    /**
     * Client state changed update
     *
     * @event onclientstatechange
     * @param {Object} client
     * @param {String} state
     */
    this.onclientstatechange = function (client, state) {
        this.log("Client state change recieved. " + client.id + " is " + state);
        switch (state) {
            case "paused":
                client.player.bubble = {
                    message: "...",
                    time: 10
                };
                break;
            case "ready":
                if (!client.player.container)
                    client.player.load(client, this.universe);
                break;
            case "requesting assets":
                this.trigger("assetUpdate", client.id, {sprites: Sprites, sounds: {}});
                break;
        }
    };

    /**
     * Update clients
     *
     * @method updateNetwork
     * @private
     * @param {Number} delta time since last update
     */
    this.updateNetwork = function (delta) {
        this.networkFps = 1 / delta;
        for (var id in this.clients)
            if (this.clients[id].player.container)
                this.updateClient(id, this.clients[id].player.getPacket(true));
    };

    /**
     * Run single frame
     *
     * @method updateUniverse
     * @private
     * @param {Number} delta time since last update
     */
    this.updateUniverse = function (delta) {
        this.universeFps = 1 / delta;
        this.universe.run();
    };

    /**
     * Log general server info on an interval
     *
     * @method logServerInfo
     */
    AnslemServer.prototype.logServerInfo = function () {
        this.log("Environment: " + AnslemServerConfig.environment);
        this.log("Network FPS: " + this.networkFps);
        this.log("Universe FPS: " + this.universeFps);
        this.log(Object.keys(this.clients).length + " player(s) currently connected");
    };

    /**
     * Start the server
     *
     * @method start
     */
    AnslemServer.prototype.start = function () {
        NodeServer.prototype.start.call(this);

        var self = this;
        this.networkloopId = gameloop.setGameLoop(function (delta) {
            self.updateNetwork.call(self, delta);
        }, 1000 / AnslemServerConfig.networkFps);
        this.universeloopId = gameloop.setGameLoop(function (delta) {
            self.updateUniverse.call(self, delta);
        }, 1000 / AnslemServerConfig.universeFps);
        this.serverInfoloopId = gameloop.setGameLoop(function (delta) {
            self.logServerInfo.call(self, delta);
        }, AnslemServerConfig.serverInfoInterval);
    };

    /**
     * Stop the server
     *
     * @method stop
     */
    AnslemServer.prototype.stop = function () {
        gameloop.clearGameLoop(this.networkloopId);
        gameloop.clearGameLoop(this.universeloopId);
        gameloop.clearGameLoop(this.serverInfoloopId);
    };
}
AnslemServer.prototype = new NodeServer();
AnslemServer.prototype.constructor = AnslemServer;

module.exports = AnslemServer;
