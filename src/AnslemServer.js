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
    clientConnected: function (client) {
        var newPlayer = new Player();
        newPlayer.load(client, AnslemServer.universe);
        AnslemServer.players[client.id] = newPlayer;
        return {message: 'Welcome to Anslem!', assets: {sprites: Sprites}, viewScale: newPlayer.view.scale};
    },
    clientDisconnected: function (clientId) {
        AnslemServer.players[clientId].destroy();
        delete AnslemServer.players[clientId];
        console.log("Client disconnected ", clientId);
    },
    clientInfoRecieved: function (clientId, info) {
        AnslemServer.players[clientId].initializeView(info.screenWidth, info.screenHeight);
    },
    currentFps: AnslemConfig.serverFps,
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
        console.log(Object.keys(AnslemServer.players).length + " player(s) currently connected");
        if (AnslemServer.running)
            setTimeout(AnslemServer.logServerInfo, AnslemConfig.serverInfoInterval);
    },
    nodeServer: new NodeServer(),
    running: false,
    players: [],
    start: function () {
        AnslemServer.running = true;
        AnslemServer.universe.populate();
        AnslemServer.nodeServer.start(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.nodeServer.clientInfoCallback = AnslemServer.clientInfoRecieved;
        AnslemServer.gameloopId = gameloop.setGameLoop(AnslemServer.update, 1000 / AnslemConfig.serverFps);
        AnslemServer.logServerInfo();
    },
    stop: function () {
        AnslemServer.running = false;
        gameloop.clearGameLoop(AnslemServer.gameloopId);
    },
    universe: new Universe(),
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
