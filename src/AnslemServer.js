/**
 * Listen for client connections and run the universe
 *
 * @module Anslem
 * @requires AnslemConfig, gameloop, idea, NodeServer, Player, Sprites, Universe
 */
var AnslemConfig = require('./AnslemConfig');
var gameloop = require('node-gameloop');
var Idea = require("./universe/Idea");
var NodeServer = require("./lib/NodeServer");
var Player = require("./universe/Player");
var Sprites = require("./universe/Sprites");
var Universe = require("./universe/Universe");

/**
 * Anslem game server wrapper
 *
 * @class AnslemServer
 * @static
 */
var AnslemServer = {
    /**
     * Client connected callback
     *
     * @method clientConnected
     * @param {Object} client
     * @return {Object} initial data to send to client
     */
    clientConnected: function (client) {
        console.log("Client connected");
        var newPlayer = new Player();
        newPlayer.load(client, AnslemServer.universe);
        AnslemServer.players[client.id] = newPlayer;
        return {message: 'Welcome to Anslem!', assets: {sprites: Sprites}, viewScale: newPlayer.view.scale};
    },
    /**
     * Client disconnected callback
     *
     * @method clientDisconnected
     * @param {Number} clientId
     */
    clientDisconnected: function (clientId) {
        console.log("Client disconnected");
        AnslemServer.players[clientId].destroy();
        delete AnslemServer.players[clientId];
    },
    /**
     * Client info recieved callback
     *
     * @method clientInfoRecieved
     * @param {Number} clientId
     * @param {Object} info
     */
    clientInfoRecieved: function (clientId, info) {
        AnslemServer.players[clientId].initializeView(info.screenWidth, info.screenHeight);
    },
    /**
     * Last calculated fps
     *
     * @property currentFps
     * @type {Number}
     */
    currentFps: AnslemConfig.serverFps,
    /**
     * Log general server info on an interval
     *
     * @method logServerInfo
     */
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
        console.log(Object.keys(AnslemServer.players).length + " player(s) currently connected");
        if (AnslemServer.running)
            setTimeout(AnslemServer.logServerInfo, AnslemConfig.serverInfoInterval);
    },
    /**
     * Node server object
     *
     * @property nodeServer
     * @type {NodeServer}
     */
    nodeServer: new NodeServer(),
    /**
     * Is the server running
     *
     * @property running
     * @type {Boolean}
     */
    running: false,
    /**
     * Player list
     *
     * @property players
     * @type {Array}
     */
    players: [],
    /**
     * Start the server
     *
     * @method start
     */
    start: function () {
        AnslemServer.running = true;
        AnslemServer.universe.populate();
        AnslemServer.nodeServer.start(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.nodeServer.clientInfoCallback = AnslemServer.clientInfoRecieved;
        AnslemServer.gameloopId = gameloop.setGameLoop(AnslemServer.update, 1000 / AnslemConfig.serverFps);
        AnslemServer.logServerInfo();
    },
    /**
     * Stop the server
     *
     * @method stop
     */
    stop: function () {
        AnslemServer.running = false;
        gameloop.clearGameLoop(AnslemServer.gameloopId);
    },
    /**
     * Universe instance
     *
     * @property universe
     * @type {Universe}
     */
    universe: new Universe(),
    /**
     * Run single frame
     *
     * @method update
     * @param {Number} delta time since last update
     */
    update: function (delta) {
        AnslemServer.currentFps = 1 / delta;
        AnslemServer.universe.run();
        for (var id in AnslemServer.players) {
            var packet = AnslemServer.players[id].container.getPacket();
            packet.viewX = AnslemServer.players[id].view.x;
            packet.viewY = AnslemServer.players[id].view.y;
            packet.contents.sort(function (a, b) {
                return a.z > b.z;
            });
            AnslemServer.nodeServer.update(id, packet);
        }
    }
};

module.exports = AnslemServer;
