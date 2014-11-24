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

/*
 * Anslem game server wrapper
 * @type Object
 */
var AnslemServer = {
    currentFps: 0,
    nodeServer: new NodeServer(),
    players: [],
    running: false,
    targetFps: 60,
    universe: false,
    clientConnected: function (client) {
        var newIdea = new Idea(['player', 'human'], client.id);
        newIdea.setImage("sprCoin");
        newIdea.gravity = 0.8;
        newIdea.baseGoal = Goals.Player;
        newIdea.clientConnection = AnslemServer.nodeServer.clients[client.id];
        newIdea.warp(
                Math.floor(Math.random() * AnslemServer.universe.position.width),
                Math.floor(Math.random() * AnslemServer.universe.position.height),
                AnslemServer.universe
                );
        newIdea.viewWidth = 500;
        newIdea.viewHeight = 500;

        AnslemServer.players[client.id] = newIdea;
        AnslemServer.nodeServer.welcome(client.id, {message: 'Welcome ' + client.id, assets: {sprites: Sprites}});
        AnslemServer.nodeServer.broadcast(client.id + " has connected.");
    },
    clientDisconnected: function (client) {
        AnslemServer.players[client.id].destroy();
        delete AnslemServer.players[client.id];
        AnslemServer.nodeServer.broadcast(client.id + " has disconnected.");
    },
    clientInfoUpdate: function (clientId, info) {
        AnslemServer.players[clientId].viewWidth = info.viewWidth;
        AnslemServer.players[clientId].viewHeight = info.viewHeight;
    },
    getPlayerScene: function (player) {
        var packet = player.position.container.getPacket();
        for (var index in packet.contents) {
            packet.contents[index].x -= (player.position.x - (player.viewWidth / 2));
            packet.contents[index].y -= (player.position.y - (player.viewHeight / 2));
        }
        return packet;
    },
    populate: function () {
        AnslemServer.universe = new Idea(42);
        AnslemServer.universe.position.width = 1000;
        AnslemServer.universe.position.height = 500;

        var mountains = new Idea(['background']);
        mountains.setImage("bgMountains", true, false, 0.5);
        mountains.warp(0, AnslemServer.universe.position.height - 500, AnslemServer.universe);
    },
    logServerInfo: function () {
        console.log("Server FPS: " + AnslemServer.currentFps);
    },
    start: function () {
        AnslemServer.running = true;
        AnslemServer.populate();
        AnslemServer.nodeServer = new NodeServer(AnslemServer.clientConnected, AnslemServer.clientDisconnected, AnslemServer.clientInfoUpdate);
        AnslemServer.nodeServer.start();
        AnslemServer.update();
        setInterval(AnslemServer.logServerInfo, 5000);
    },
    stop: function () {
        AnslemServer.running = false;
    },
    update: function () {
        var thisFrameTime = Date.now();
        if (!AnslemServer.lastFrameTime || (thisFrameTime > AnslemServer.lastFrameTime + (1000 / AnslemServer.targetFps))) {
            AnslemServer.currentFps = 1000 / (thisFrameTime - AnslemServer.lastFrameTime);
            AnslemServer.lastFrameTime = thisFrameTime;
            AnslemServer.universe.run();
            for (var id in AnslemServer.players) {
                var player = AnslemServer.players[id];
                AnslemServer.nodeServer.update(AnslemServer.getPlayerScene(player), id);
            }
        }
        setImmediate(AnslemServer.update);
    }
};

AnslemServer.start();
