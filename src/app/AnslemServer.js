/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemServerConfig, compileAnslem, fs, gameloop, NodeServer, Sprites, UniverseConfig
 */
var Anslem = require("../universe/compileAnslem");
var AnslemServerConfig = require('./AnslemServerConfig');
var fs = require('fs');
var gameloop = require('node-gameloop');
var NodeServer = require("../lib/NodeServer");
var Sprites = require("../universe/Sprites");
var UniverseConfig = require("../universe/UniverseConfig");

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
     * Split packets into chunks
     *
     * @property packetIndex
     * @type {Number}
     */
    var packetIndex = 0;

    /**
     * Number of chunks
     *
     * @property packetSplit
     * @type {Number}
     */
    var packetSplit = AnslemServerConfig.networkFps / 30;

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
     * Universe instance, start populated
     *
     * @property universe
     * @type {Universe}
     */
    this.universe = new Anslem.Universe();

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

        client.player = new Anslem.Player(client);
        var self = this;
        client.sendViewUpdate = function () {
            self.trigger("viewUpdate", client.id, {width: client.player.view.width, height: client.player.view.height});
        };

        return {message: 'Welcome to Anslem!'};
    };

    /**
     * Client disconnected callback
     *
     * @method onclientdisconnect
     * @param {Object} client
     */
    this.onclientdisconnect = function (client) {
        // TEMP, for fun
        var skeleton = new Anslem.Skeleton();
        skeleton.warp(client.player.x, client.player.y, client.player.container);

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
        client.player.initializeView();
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
                this.updateClient(id, this.clients[id].player.getPacket(true, packetIndex, packetSplit));
        if (++packetIndex === packetSplit)
            packetIndex = 0;
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
     * Loads a snapshot of the universe from a file
     *
     * @method saveSnapshot
     * @param {String} snapfile
     */
    AnslemServer.prototype.loadSnapshot = function (snapfile) {
        var simple = JSON.parse(fs.readFileSync(snapfile, 'utf-8'));
        this.universe.load(simple);
        this.universe.associate();
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
        this.log("Population: " + this.universe.size());
        this.log(Object.keys(this.clients).length + " player(s) currently connected");
        for (var index in this.clients) {
            this.log("Client[" + this.clients[index].id + "]  Latency: " + this.clients[index].latency);
        }
    };

    /**
     * Saves a snapshot of the universe to file
     *
     * @method saveSnapshot
     */
    AnslemServer.prototype.saveSnapshot = function () {
        this.snapItr = this.snapItr || 0;
        if (this.snapItr > AnslemServerConfig.snapsToKeep)
            this.snapItr = 0;
        var simple = this.universe.toSimple();
        var filename = "snapshot." + this.snapItr++ + ".json";
        fs.writeFileSync(__dirname + "/snapshots/" + filename, JSON.stringify(simple), 'utf-8');
        console.log(__dirname + "/" + filename + " built.");
    };

    /**
     * Start the server
     *
     * @method start
     * @param {String} snapfile to load from
     */
    AnslemServer.prototype.start = function (snapfile) {
        NodeServer.prototype.start.call(this);

        var self = this;
        this.networkloopId = gameloop.setGameLoop(function (delta) {
            self.updateNetwork.call(self, delta);
        }, 1000 / AnslemServerConfig.networkFps);
        this.universeloopId = gameloop.setGameLoop(function (delta) {
            self.updateUniverse.call(self, delta);
        }, 1000 / AnslemServerConfig.universeFps);

        this.serverInfoloopId = setInterval(function () {
            self.logServerInfo.call(self);
        }, AnslemServerConfig.serverInfoInterval);
        this.snapshotloopId = setInterval(function () {
            self.saveSnapshot.call(self);
        }, AnslemServerConfig.snapshotInterval);

        if (snapfile)
            this.loadSnapshot(snapfile);
        else
            this.universe.populate();
    };

    /**
     * Stop the server
     *
     * @method stop
     */
    AnslemServer.prototype.stop = function () {
        gameloop.clearGameLoop(this.networkloopId);
        gameloop.clearGameLoop(this.universeloopId);
        clearInterval(this.serverInfoloopId);
        clearInterval(this.snapshotloopId);
    };
}
AnslemServer.prototype = new NodeServer();
AnslemServer.prototype.constructor = AnslemServer;

module.exports = AnslemServer;
