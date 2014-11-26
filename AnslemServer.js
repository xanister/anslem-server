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
    viewScale: 2,
    viewSpeed: 0.3,
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
        return {message: 'Welcome to Anslem!', assets: {sprites: Sprites}, viewScale: AnslemServer.players[client.id].view.scale};
    },
    clientDisconnected: function (clientId) {
        AnslemServer.players[clientId].destroy();
        delete AnslemServer.players[clientId];
    },
    currentFps: 0,
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
        player.describe(['physical', 'human', 'player'], "A player label", "A player description", "sprGoblin", anslemConfig.gravity, Goals.Player);
        player.warp(400, 400, AnslemServer.universe);

        var dim = client.handshake.query.initialData ? client.handshake.query.initialData.split(',') : [500, 500];
        dim[0] *= anslemConfig.viewScale;
        dim[1] *= anslemConfig.viewScale;
        player.view = {
            x: player.position.x - (dim[0] / 2),
            y: player.position.y - (dim[1] / 2),
            xBuffer: parseInt(dim[0] * anslemConfig.viewXBuffer),
            yBuffer: parseInt(dim[1] * anslemConfig.viewYBuffer),
            scale: anslemConfig.viewScale,
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
        AnslemServer.universe.position.width = 40000;
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