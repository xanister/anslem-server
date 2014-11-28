/**
 * Player
 *
 * @module Anslem.Universe
 * @requires AnslemConfig, Entity, Goals
 */
var AnslemConfig = require("./../AnslemConfig");
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
        var viewWidth = screenWidth * AnslemConfig.viewScale;
        var viewHeight = screenHeight * AnslemConfig.viewScale;
        this.view = {
            x: this.x - (viewWidth / 2),
            y: this.y - (viewHeight / 2),
            xBuffer: parseInt(viewWidth * AnslemConfig.viewXBuffer),
            yBuffer: parseInt(viewHeight * AnslemConfig.viewYBuffer),
            scale: AnslemConfig.viewScale,
            speed: AnslemConfig.viewSpeed,
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
        var xDist = this.x - (this.view.x + (this.view.width / 2));
        if (xDist < -this.view.xBuffer)
            this.view.x -= ((-xDist - this.view.xBuffer) * AnslemConfig.viewSpeed);
        else if (xDist > this.view.xBuffer)
            this.view.x += ((xDist - this.view.xBuffer) * AnslemConfig.viewSpeed);

        var yDist = this.y - (this.view.y + (this.view.height / 2));
        if (yDist < -this.view.yBuffer)
            this.view.y -= ((-yDist - this.view.xBuffer) * AnslemConfig.viewSpeed);
        else if (yDist > this.view.yBuffer)
            this.view.y += ((yDist - this.view.xBuffer) * AnslemConfig.viewSpeed);

        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.y > (this.container.height - this.view.height))
            this.view.y = this.container.height - this.view.height;
    };
}
Player.prototype = new Entity();
Player.prototype.constructor = Entity;

module.exports = Player;