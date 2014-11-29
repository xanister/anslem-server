/**
 * Player
 *
 * @module Anslem.Universe
 * @requires AnslemServerConfig, Entity, Goals
 */
var AnslemServerConfig = require("./../AnslemServerConfig");
var Entity = require("./Entity");
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
    this.categories = ['physical', 'entity', 'player'];

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
        this.setSprite("sprGoblin");
        this.client = client;
        this.warp(400, 400, universe);
        this.inputs = client.inputs;
        this.initializeView(client.info.screenWidth, client.info.screenHeight);
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

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