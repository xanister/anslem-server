/**
 * Player
 *
 * @module Anslem.Universe
 */

/**
 * Player
 *
 * @class Player
 * @constructor
 * @extends Entity
 * @param {Object} client
 */
function Player(client) {
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
    this.categories.push('hasbrains');
    this.categories.push('player');

    /**
     * Client connection
     *
     * @property client
     * @type {Object}
     */
    this.client = client;

    /**
     * Attached user inputs for easy access
     *
     * @property inputs
     * @type {Object}
     */
    this.inputs = client.inputs;

    /**
     * Player view
     *
     * @property view
     * @type {Object}
     */
    this.view = {
        x: 0,
        y: 0,
        xBuffer: this.client.info.screenWidth * UniverseConfig.viewXBuffer,
        yBuffer: this.client.info.screenWidth * UniverseConfig.viewYBuffer,
        scale: UniverseConfig.viewScale,
        speed: UniverseConfig.viewSpeed,
        width: this.client.info.screenWidth * UniverseConfig.viewScale,
        height: this.client.info.screenHeight * UniverseConfig.viewScale
    };

    /**
     * Generate packet of information required
     * to render the scene to send to client
     *
     * @method getPacket
     * @param {Boolean} includeInView
     * @return {Object}
     */
    Player.prototype.getPacket = function (includeInView) {
        var packet = Entity.prototype.getPacket.call(this);
        if (includeInView) {
            packet.viewX = this.view.x;
            packet.viewY = this.view.y;
            packet.inView = {};
            for (var index in this.inView) {
                packet.inView[this.inView[index].id] = this.inView[index].getPacket();
            }
        }
        return packet;
    };

    /**
     * Initialize player view
     *
     * @method initializeView
     * @param {Number} scale
     */
    Player.prototype.initializeView = function (scale) {
        scale = scale || UniverseConfig.viewScale;
        var viewWidth = this.client.info.screenWidth * scale;
        var viewHeight = this.client.info.screenHeight * scale;

        this.view = {
            x: this.x - (viewWidth / 2),
            y: this.y - (viewHeight / 2),
            xBuffer: viewWidth * UniverseConfig.viewXBuffer,
            yBuffer: viewHeight * UniverseConfig.viewYBuffer,
            scale: scale,
            speed: UniverseConfig.viewSpeed * scale,
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
        // TODO: Pull from persister
        this.warp(200, universe.height - (this.height / 2), universe.contents[0][Object.keys(universe.contents[0])[0]]);
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

        // Clear events
        this.inputs.events = {};

        // Standing over activatable object
        this.overActivatable = this.instancePlace("activatable");

        // Bubble]
        if (this.inputs.message) {
            this.bubble = {
                message: this.inputs.message,
                time: 60
            };
            this.inputs.message = false;
        } else if (this.overActivatable) {
            this.bubble = {
                message: "",
                star: true,
                time: 5
            };
        }


        // Maintain view
        if (this.x > this.view.x + this.view.width - this.view.xBuffer)
            this.view.x = this.x + this.view.xBuffer - this.view.width;
        else if (this.x < this.view.x + this.view.xBuffer)
            this.view.x = this.x - this.view.xBuffer;
        if (this.y > this.view.y + this.view.height - this.view.yBuffer)
            this.view.y = this.y + this.view.yBuffer - this.view.height;
        else if (this.y < this.view.y + this.view.yBuffer)
            this.view.y = this.y - this.view.yBuffer;

        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.x + this.view.width > this.container.width)
            this.view.x = this.container.width - this.view.width;
        if (this.view.y > (this.container.height - this.view.height))
            this.view.y = this.container.height - this.view.height;
    };

    /*
     * Player defaults
     */
    this.setSprite("goblin");
    this.stats.perception *= 4;
    this.stats.strength = 50;
}
Player.prototype = new Entity();
Player.prototype.constructor = Entity;

Anslem.Player = Player;
