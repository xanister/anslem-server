/**
 * AnslemServer.js
 * Compile all actions and goals and return Goals module
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 */

/**
 * Includes
 */
var NodeServer = require("./lib/NodeServer");
var Idea = require("./universe/Idea");
var Sprites = require("./universe/Sprites");
var Goals = require("./universe/Goals");
var gameloop = require('node-gameloop');

var anslemConfig = {
    gravity: 0.8,
    linearDampening: 0.5
};

/*
 * Anslem game server wrapper
 * @type Object
 */
var AnslemServer = {
    clientConnected: function (client) {
        var newIdea = new Idea();
        newIdea.describe(['player', 'human'], "A player label", "A player description", "sprGoblin", anslemConfig.gravity, Goals.player);
        newIdea.inputs = AnslemServer.nodeServer.clients[client.id].inputs;
        newIdea.warp(400, 400, AnslemServer.universe);
        AnslemServer.players[client.id] = newIdea;
        return {message: 'Welcome ' + client.id, assets: {sprites: Sprites}};
    },
    clientDisconnected: function (client) {
        AnslemServer.players[client.id].destroy();
        delete AnslemServer.players[client.id];
    },
    currentFps: 0,
    getPlayerPacket: function (player) {
        var packet = player.position.container.getPacket();
        packet.player = player.getPacket();
        return packet;
    },
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
        console.log(Object.keys(AnslemServer.players).length + " player(s) currently connected");
        if (AnslemServer.running)
            setTimeout(AnslemServer.logServerInfo, 5000);
    },
    nodeServer: new NodeServer(),
    populate: function () {
        AnslemServer.universe = new Idea();
        AnslemServer.universe.position.width = 1000;
        AnslemServer.universe.position.height = 500;

        var mountains = new Idea();
        mountains.describe(
                ['background'],
                'Blue Ridge Mountains',
                'Misty and ominous'
                );
        mountains.setImage("bgMountains", true, false, 0.5);
        mountains.warp(0, AnslemServer.universe.position.height - 500, AnslemServer.universe);

        var coin = new Idea();
        coin.describe(['coin'], "Rupie", "Simple currency", "sprCoin", anslemConfig.gravity);
        coin.warp(50, 50, AnslemServer.universe);
    },
    running: false,
    players: [],
    start: function () {
        AnslemServer.running = true;
        AnslemServer.populate();
        AnslemServer.nodeServer.start(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.gameloopId = gameloop.setGameLoop(AnslemServer.update, 1000 / AnslemServer.targetFps);
        setTimeout(AnslemServer.logServerInfo, 5000);
    },
    stop: function () {
        AnslemServer.running = false;
        gameloop.clearGameLoop(AnslemServer.gameloopId);
    },
    targetFps: 30,
    universe: false,
    update: function (delta) {
        AnslemServer.currentFps = 1 / delta;
        AnslemServer.universe.run();
        for (var id in AnslemServer.players) {
            AnslemServer.nodeServer.update(AnslemServer.getPlayerPacket(AnslemServer.players[id]), id);
        }
    }
};

AnslemServer.start();
