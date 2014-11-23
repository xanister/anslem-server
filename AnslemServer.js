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
        if (!AnslemServer.lastFrame || (Date.now() > AnslemServer.lastFrame + (1000 / AnslemServer.targetFps))) {
            AnslemServer.lastFrame = Date.now();
            AnslemServer.universe.run();
            for (var index in AnslemServer.universe.contents['player']) {
                AnslemServer.nodeServer.update(AnslemServer.universe.getPacket(), AnslemServer.universe.contents['player'][index].id);
            }
        }
        console.log(AnslemServer.lastFrame);
    }
};

AnslemServer.start();