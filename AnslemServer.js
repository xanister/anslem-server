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
    linearDampening: 0.5,
    port: 3000,
    viewSpeed: 5,
    viewXBuffer: 0.2,
    viewYBuffer: 0.1
};

/*
 * Anslem game server wrapper
 * @type Object
 */
var AnslemServer = {
    clientConnected: function (client) {
        AnslemServer.players[client.id] = AnslemServer.loadPlayer(client);
        return {message: 'Welcome to Anslem!', assets: {sprites: Sprites}};
    },
    clientDisconnected: function (clientId) {
        AnslemServer.players[clientId].destroy();
        delete AnslemServer.players[clientId];
    },
    currentFps: 0,
    getPlayerPacket: function (player) {
        var packet = player.position.container.getPacket();
        packet.player = player.getPacket();

        // TODO: figure out view follow issue
        // Update the view
//        if ((player.position.x - player.view.x) < (player.view.xBuffer)) {
//            player.view.x = player.position.x - player.view.xBuffer;
//            if (player.view.x < 0)
//                player.view.x = 0;
//        } else if ((player.position.x + player.view.xBuffer) > (player.view.x + player.view.width)) {
//            player.view.x = player.position.x + player.view.xBuffer;
//            if (player.view.x + player.view.width > player.position.container.position.width)
//                player.view.x = player.position.container.position.width;
//        }
//
//        if (player.position.y - player.view.y < player.view.yBuffer) {
//            player.view.y = player.position.y - player.view.yBuffer;
//            if (player.view.y < 0)
//                player.view.y = 0;
//        } else if (player.position.y + player.view.yBuffer > player.view.y + player.view.height) {
//            player.view.y = player.position.y + player.view.yBuffer;
//            if (player.view.y + player.view.height > player.position.container.position.height)
//                player.view.y = player.position.container.position.height - player.view.height;
//        }
//
//        packet.viewX = player.view.x;
//        packet.viewY = player.view.y;

        packet.viewX = player.position.x - (player.view.width * 0.5);
        packet.viewY = player.position.y - (player.view.height * 0.5);
        return packet;
    },
    loadPlayer: function (client) {
        var player = new Idea();
        player.describe(['physical', 'human', 'player'], "A player label", "A player description", "sprGoblin", anslemConfig.gravity, Goals.Player);
        player.warp(40, 400, AnslemServer.universe);

        var dim = client.handshake.query.initialData ? client.handshake.query.initialData.split(',') : [500, 500];
        player.view = {
            x: player.position.x - (dim[0] / 2),
            y: player.position.y - (dim[1] / 2),
            xBuffer: parseInt(dim[0] * anslemConfig.viewXBuffer),
            yBuffer: parseInt(dim[1] * anslemConfig.viewYBuffer),
            speed: anslemConfig.viewSpeed,
            width: dim[0],
            height: dim[1]
        };
        player.inputs = client.inputs;

        return player;
    },
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
        console.log(Object.keys(AnslemServer.players).length + " player(s) currently connected");
        if (AnslemServer.running)
            setTimeout(AnslemServer.logServerInfo, 5000);
    },
    nodeServer: new NodeServer(anslemConfig.port),
    populate: function () {
        AnslemServer.universe = new Idea();
        AnslemServer.universe.position.width = 4000;
        AnslemServer.universe.position.height = 2048;

        var mountains = new Idea();
        mountains.describe(
                ['background'],
                'Blue Ridge Mountains',
                'Misty and ominous'
                );
        mountains.setSprite("bgMountains", true, false, 0.5);
        mountains.warp(0, AnslemServer.universe.position.height - (mountains.position.height / 2), AnslemServer.universe);

        var ground = new Idea();
        ground.describe(
                ['background'],
                'Black ground',
                '...'
                );
        ground.setSprite("bgGround", true, false);
        ground.warp(0, AnslemServer.universe.position.height + (ground.position.height / 2), AnslemServer.universe);

        var coin = new Idea();
        coin.describe(['physical', 'coin'], "Rupie", "Simple currency", "sprCoin", anslemConfig.gravity);
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
            var packet = AnslemServer.getPlayerPacket(AnslemServer.players[id]);
            AnslemServer.nodeServer.update(id, packet);
        }
    }
};

AnslemServer.start();