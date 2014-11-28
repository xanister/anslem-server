/**
 * AnslemServer.js
 * Run the world
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 *
 * @module Anslem
 * @requires AnslemConfig, gameloop, Goals, Idea, NodeServer
 */
var AnslemConfig = require('./AnslemConfig');
var Entity = require("./universe/Entity");
var gameloop = require('node-gameloop');
var Goals = require("./universe/compileGoals");
var Idea = require("./universe/Idea");
var NodeServer = require("./lib/NodeServer");
var Player = require("./universe/Player");
var Sprites = require("./universe/Sprites");

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
    populate: function () {
        AnslemServer.universe = new Idea();
        AnslemServer.universe.width = 40000;
        AnslemServer.universe.height = 2048;

        var i = new Idea();
        i.describe(['background'], 'Clouds', 'Clouds');
        i.setSprite("bgClouds", true, false, 0.2);
        i.warp(0, AnslemServer.universe.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(['background'], 'Mountains', 'Mountains');
        i.setSprite("bgMountains", true, false, 0.4);
        i.warp(0, AnslemServer.universe.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(['background'], 'Blue Ridge Mountains', 'Misty and ominous');
        i.setSprite("bgMountainsMidground", true, false, 0.6);
        i.warp(0, AnslemServer.universe.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(['background'], 'Forest', 'Forest');
        i.setSprite("bgTrees", true, false, 0.8);
        i.warp(0, AnslemServer.universe.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(['background'], 'Ground', 'Ground');
        i.setSprite("bgGround", true, false, 1);
        i.warp(0, AnslemServer.universe.height + (Sprites[i.sprite.image].height / 2), AnslemServer.universe);
    },
    running: false,
    players: [],
    start: function () {
        AnslemServer.running = true;
        AnslemServer.populate();
        AnslemServer.nodeServer.start(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.nodeServer.clientInfoCallback = AnslemServer.clientInfoRecieved;
        AnslemServer.gameloopId = gameloop.setGameLoop(AnslemServer.update, 1000 / AnslemServer.targetFps);
        AnslemServer.logServerInfo();
    },
    stop: function () {
        AnslemServer.running = false;
        gameloop.clearGameLoop(AnslemServer.gameloopId);
    },
    targetFps: AnslemConfig.serverFps,
    universe: false,
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
