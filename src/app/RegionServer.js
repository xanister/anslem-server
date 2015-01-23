/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemServerConfig, async, compileAnslem, fs, gameloop, NodeServer, Sprites, UniverseConfig
 */
var Anslem = require("../universe/compileAnslem");
var AnslemServerConfig = require('./AnslemServerConfig');
var gameloop = require('node-gameloop');
var NodeServer = require("../lib/NodeServer");
var usage = require('usage');

/**
 * Anslem game server wrapper
 *
 * @class RegionServer
 * @constructor
 * @extends NodeServer
 * @param {String} regionSlug
 */
function RegionServer(regionSlug) {
    NodeServer.call(this, AnslemServerConfig.port + Anslem.Regions[regionSlug].portOffset);

    /**
     * Region instance
     *
     * @property region
     * @type {Region}
     */
    this.region = new Anslem[Anslem.Regions[regionSlug].type]();

    /**
     * Last calculated region fps
     *
     * @property regionFps
     * @type {Number}
     */
    this.regionFps = AnslemServerConfig.regionFps;

    /**
     * Client connected. Create new player and attach to client
     *
     * @method onclientconnect
     * @param {Object} client
     */
    this.onclientconnect = function (client) {
        this.log("connection received");

        var self = this;
        client.on("playerjoin", function (event) {
            self.log("playerjoin received" + (event.playerId ? " from player " + event.playerId : " from new player"));
            if (event.playerId) {
                Anslem.Population[event.playerId].attachClient(client);
                client.trigger("transition", {class: "pt-page-moveFromBottom", pauseRender: 30});
            } else {
                var newPlayer = new Anslem.Player();
                newPlayer.attachClient(client, function () {
                    self.log("player " + newPlayer.id + " ready");
                    newPlayer.warp(500, 500, self.region);
                });
            }
        });

        client.on("warp", function (event) {
            self.log("warp received");
            var newIdea = new Anslem[event.idea.type]();
            newIdea.fromSimple(event.idea);
            newIdea.warp(event.x, event.y, self.region.findBySlug(event.regionSlug));
        });
    };

    /**
     * Log general server info on an interval
     *
     * @method logServerInfo
     */
    RegionServer.prototype.logServerInfo = function () {
        this.log("Region: " + this.region.slug);
        this.log("Environment: " + AnslemServerConfig.environment);
        this.log("Population: " + this.region.size());
        this.log(Object.keys(this.clients).length + " player(s) currently connected");
        for (var index in this.clients) {
            this.log("Client[" + this.clients[index].id + "]  Latency: " + this.clients[index].latency);
        }
        this.log("Region FPS(" + AnslemServerConfig.regionFps + "): " + this.regionFps);
        var self = this;
        usage.lookup(process.pid, function (err, result) {
            self.log("CPU Usage(%): " + result.cpu);
            self.log("Memory Usage(MB): " + result.memory / 1000000);
        });
    };

    /**
     * Start the server
     *
     * @method start
     */
    RegionServer.prototype.start = function () {
        NodeServer.prototype.start.call(this);

        this.region.init(regionSlug);
        this.region.populate();

        this.log("started listening on port " + this.port);

        var self = this;
        this.regionloopId = gameloop.setGameLoop(function (delta) {
            self.regionFps = 1 / delta;
            self.region.run();
        }, 1000 / AnslemServerConfig.regionFps);
        this.serverInfoloopId = setInterval(function () {
            self.logServerInfo.call(self);
        }, AnslemServerConfig.serverInfoInterval);
    };
}
RegionServer.prototype = new NodeServer();
RegionServer.prototype.constructor = RegionServer;

module.exports = RegionServer;
