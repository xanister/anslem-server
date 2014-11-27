/**
 * AnslemServer.js
 * Run the world
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 *
 * @module Anslem
 * @requires anslemConfig, gameloop, Goals, Idea, NodeServer
 */
var anslemConfig = require('./anslemConfig');
var gameloop = require('node-gameloop');
var goals = require("./universe/compileGoals");
var Idea = require("./universe/Idea");
var NodeServer = require("./lib/NodeServer");
var Sprites = require("./universe/Sprites");

/*
 * Anslem game server wrapper
 *
 * @class AnslemServer
 * @static
 */
var AnslemServer = {
    clientConnected: function (client) {
        var newPlayer = AnslemServer.loadPlayer(client);
        AnslemServer.players[client.id] = newPlayer;
        return {message: 'Welcome to Anslem!', assets: {sprites: Sprites}, viewScale: newPlayer.view.scale};
    },
    clientDisconnected: function (clientId) {
        AnslemServer.players[clientId].destroy();
        delete AnslemServer.players[clientId];
        console.log("Client disconnected ", clientId);
    },
    currentFps: anslemConfig.serverFps,
    getPlayerPacket: function (player) {
        var packet = player.position.container.getPacket();
        packet.player = player.getPacket();

        var xDist = player.position.x - (player.view.x + (player.view.width / 2));
        if (xDist < -player.view.xBuffer)
            player.view.x -= ((-xDist - player.view.xBuffer) * anslemConfig.viewSpeed);
        else if (xDist > player.view.xBuffer)
            player.view.x += ((xDist - player.view.xBuffer) * anslemConfig.viewSpeed);

        var yDist = player.position.y - (player.view.y + (player.view.height / 2));
        if (yDist < -player.view.yBuffer)
            player.view.y -= ((-yDist - player.view.xBuffer) * anslemConfig.viewSpeed);
        else if (yDist > player.view.yBuffer)
            player.view.y += ((yDist - player.view.xBuffer) * anslemConfig.viewSpeed);

        if (player.view.x < 0)
            player.view.x = 0;
        if (player.view.y > (player.position.container.position.height - player.view.height))
            player.view.y = player.position.container.position.height - player.view.height;

        packet.viewX = player.view.x;
        packet.viewY = player.view.y;
        return packet;
    },
    loadPlayer: function (client) {
        var player = new Idea();
        player.describe(['physical', 'human', 'player'], "A player label", "A player description", "sprGoblin", anslemConfig.gravity, goals.Player);
        player.warp(400, 400, AnslemServer.universe);

        player.view = {
            x: player.position.x - ((client.info.screenWidth * anslemConfig.viewScale) / 2),
            y: player.position.y - ((client.info.screenHeight * anslemConfig.viewScale) / 2),
            xBuffer: parseInt((client.info.screenWidth * anslemConfig.viewScale) * anslemConfig.viewXBuffer),
            yBuffer: parseInt((client.info.screenHeight * anslemConfig.viewScale) * anslemConfig.viewYBuffer),
            scale: anslemConfig.viewScale,
            speed: anslemConfig.viewSpeed,
            width: (client.info.screenWidth * anslemConfig.viewScale),
            height: (client.info.screenHeight * anslemConfig.viewScale)
        };
        player.inputs = client.inputs;

        return player;
    },
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
        console.log(Object.keys(AnslemServer.players).length + " player(s) currently connected");
        if (AnslemServer.running)
            setTimeout(AnslemServer.logServerInfo, anslemConfig.serverInfoInterval);
    },
    nodeServer: new NodeServer(),
    populate: function () {
        AnslemServer.universe = new Idea();
        AnslemServer.universe.position.width = 40000;
        AnslemServer.universe.position.height = 2048;

        var i = new Idea();
        i.describe(
                ['background'],
                'Clouds',
                'Clouds'
                );
        i.setSprite("bgClouds", true, false, 0.2);
        i.warp(0, AnslemServer.universe.position.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(
                ['background'],
                'Mountains',
                'Mountains'
                );
        i.setSprite("bgMountains", true, false, 0.4);
        i.warp(0, AnslemServer.universe.position.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(
                ['background'],
                'Blue Ridge Mountains',
                'Misty and ominous'
                );
        i.setSprite("bgMountainsMidground", true, false, 0.6);
        i.warp(0, AnslemServer.universe.position.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(
                ['background'],
                'Forest',
                'Forest'
                );
        i.setSprite("bgTrees", true, false, 0.8);
        i.warp(0, AnslemServer.universe.position.height - Sprites[i.sprite.image].height, AnslemServer.universe);

        var i = new Idea();
        i.describe(
                ['background'],
                'Ground',
                'Ground'
                );
        i.setSprite("bgGround", true, false, 1);
        i.warp(0, AnslemServer.universe.position.height + (Sprites[i.sprite.image].height / 2), AnslemServer.universe);
    },
    running: false,
    players: [],
    start: function () {
        AnslemServer.running = true;
        AnslemServer.populate();
        AnslemServer.nodeServer.start(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.gameloopId = gameloop.setGameLoop(AnslemServer.update, 1000 / AnslemServer.targetFps);
        AnslemServer.logServerInfo();
    },
    stop: function () {
        AnslemServer.running = false;
        gameloop.clearGameLoop(AnslemServer.gameloopId);
    },
    targetFps: anslemConfig.serverFps,
    universe: false,
    update: function (delta) {
        AnslemServer.currentFps = 1 / delta;
        AnslemServer.universe.run();
        for (var id in AnslemServer.players) {
            var packet = AnslemServer.getPlayerPacket(AnslemServer.players[id]);
            AnslemServer.nodeServer.update(id, packet);
        }
    }
};

AnslemServer.start();
