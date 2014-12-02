/**
 * Player
 *
 * @module Anslem.Universe
 * @requires AnslemServerConfig, Entity, Goals
 */
var AnslemServerConfig = require("./../AnslemServerConfig");
var Entity = require("./Entity");
var Idea = require("./Idea");
var Goals = require("./Goals.compiled");

/**
 * Player
 *
 * @class Player
 * @constructor
 * @extends Entity
 */
function Player() {
    Entity.call(this);
    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = Goals.PlayerInput;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('player');

    /**
     * Client connection
     *
     * @property client
     * @type {Object}
     */
    this.client = false;

    /**
     * Player view
     *
     * @property view
     * @type {Object}
     */
    this.view = false;

    /**
     * Generate packet of information required
     * to render the scene to send to client
     *
     * @method getPacket
     * @param {Boolean} includeInView
     * @return {Object}
     */
    Player.prototype.getPacket = function (includeInView) {
        var packet = Idea.prototype.getPacket.call(this);
        if (includeInView) {
            packet.viewX = this.view.x;
            packet.viewY = this.view.y;
            packet.inView = [];
            packet.goal = this.baseGoal.label;
            packet.action = this.action.label;
            packet.actionProgress = this.action.progress;
            packet.health = this.stats.health;
            packet.categories = this.categories;
            for (var index in this.inView) {
                packet.inView.push(this.inView[index].getPacket());
            }
        }
        return packet;
    };

    /**
     * Initialize player view
     *
     * @method initializeView
     * @param {Number} screenWidth
     * @param {Number} screenHeight
     */
    Player.prototype.initializeView = function (screenWidth, screenHeight) {
        var viewWidth = screenWidth * AnslemServerConfig.viewScale;
        var viewHeight = screenHeight * AnslemServerConfig.viewScale;
        this.view = {
            x: this.x - (viewWidth / 2),
            y: this.y - (viewHeight / 2),
            xBuffer: parseInt(viewWidth * AnslemServerConfig.viewXBuffer),
            yBuffer: parseInt(viewHeight * AnslemServerConfig.viewYBuffer),
            scale: AnslemServerConfig.viewScale,
            speed: AnslemServerConfig.viewSpeed,
            width: viewWidth,
            height: viewHeight
        };
    };

    /**
     * Load
     *
     * @method load
     * @param {Object} client
     * @param {Idea} universe
     */
    Player.prototype.load = function (client, universe) {
        this.setSprite("goblin");
        this.client = client;
        this.warp(400, 400, universe);
        this.inputs = client.inputs;
        this.stats.speed = 20;
        this.stats.perception = 3000;
        this.initializeView(client.info.screenWidth, client.info.screenHeight);
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

        // Bubble
        if (this.bubble && this.bubble.time-- <= 0)
            this.bubble = false;
        if (this.inputs.message) {
            this.bubble = {
                message: this.inputs.message,
                time: AnslemServerConfig.bubbleTime
            };
            this.inputs.message = false;
        }

        // Maintain view
        if (this.view.y > (this.container.height - this.view.height))
            this.view.y = this.container.height - this.view.height;

        var xDist = this.x - (this.view.x + (this.view.width / 2));
        if (xDist < -this.view.xBuffer)
            this.view.x = this.x - (this.view.width / 2) + this.view.xBuffer;
        else if (xDist > this.view.xBuffer)
            this.view.x = this.x - (this.view.width / 2) - this.view.xBuffer;

        var yDist = this.y - (this.view.y + (this.view.height / 2));
        if (yDist < -this.view.yBuffer)
            this.view.y = this.y - (this.view.height / 2) + this.view.yBuffer;
        else if (yDist > this.view.yBuffer)
            this.view.y = this.y - (this.view.height / 2) - this.view.yBuffer;

        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.x + this.view.width > this.container.width)
            this.view.x = this.container.width - this.view.width;
    };
}
Player.prototype = new Entity();
Player.prototype.constructor = Entity;

module.exports = Player;