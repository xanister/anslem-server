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
    running: false,
    targetFps: 60,
    universe: false,
    clientConnected: function (client) {
        var newIdea = new Idea(client.id, ['player', 'human']);
        newIdea.sprite = "sprCoin";
        newIdea.baseGoal = Goals.Player;
        newIdea.clientConnection = AnslemServer.nodeServer.clients[client.id];
        AnslemServer.nodeServer.clients[client.id].player = newIdea;
        newIdea.warp(
                Math.floor(Math.random() * AnslemServer.universe.position.xSize),
                Math.floor(Math.random() * AnslemServer.universe.position.ySize),
                AnslemServer.universe
                );
        AnslemServer.nodeServer.welcome(client.id, {message: 'Welcome ' + client.id, assets: {sprites: Sprites}});
        AnslemServer.nodeServer.broadcast(client.id + " has connected.");
    },
    clientDisconnected: function (client) {
        AnslemServer.universe.contents[0][client.id].remove();
        AnslemServer.nodeServer.message(client.id, "Goodbye " + client.id);
        AnslemServer.nodeServer.broadcast(client.id + " has disconnected.");
    },
    getPlayerScene: function (player) {
        player.viewWidth = 500;
        player.viewHeight = 500;
        var packet = player.position.container.getPacket();
        for (var index in packet.contents) {
            packet.contents[index].x -= (player.x - (player.viewWidth / 2));
            packet.contents[index].y -= (player.y - (player.viewHeight / 2));
        }
    },
    populate: function () {
        AnslemServer.universe = new Idea(42);
        AnslemServer.universe.position.xSize = 1000;
        AnslemServer.universe.position.ySize = 500;

        var mountains = new Idea();
        mountains.sprite = "bgMountains";
        mountains.spriteTileX = true;
        mountains.warp(0, AnslemServer.universe.position.ySize - 500, AnslemServer.universe);
    },
    start: function () {
        AnslemServer.running = true;
        AnslemServer.populate();
        AnslemServer.nodeServer = new NodeServer(AnslemServer.clientConnected, AnslemServer.clientDisconnected);
        AnslemServer.nodeServer.start();
        AnslemServer.update();
    },
    stop: function () {
        AnslemServer.running = false;
    },
    update: function () {
        if (!AnslemServer.lastFrameTime || (Date.now() > AnslemServer.lastFrameTime + (1000 / AnslemServer.targetFps))) {
            AnslemServer.lastFrameTime = Date.now();
            AnslemServer.universe.run();
            for (var id in AnslemServer.nodeServer.clients) {
                var player = AnslemServer.nodeServer.clients[id].player;
                var packet = player.position.container.getPacket();
                AnslemServer.nodeServer.update(packet, id);
            }
        }
        setImmediate(AnslemServer.update);
    }
};

AnslemServer.start();