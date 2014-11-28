/**
 * Entity
 *
 * @module Anslem.Universe
 * @requires AnslemConfig, Idea, Synapse
 */
var AnslemConfig = require("./../AnslemConfig");
var Goals = require("./compileGoals");
var Idea = require("./Idea");
var Synapse = require("./Synapse");

/**
 * Entity
 *
 * @class Entity
 * @constructor
 * @extends Idea
 */
function Entity() {
    /**
     * Current action
     *
     * @property action
     * @type {Action}
     */
    this.action = false;

    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = false;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories = ['physical', 'entity'];

    /**
     * Current goal
     *
     * @property goal
     * @type {Goal}
     */
    this.goal = false;

    /**
     * Falling speed
     *
     * @property gravity
     * @type {Number}
     */
    this.gravity = AnslemConfig.gravity;

    /**
     * Memories
     *
     * @property memory
     * @type {Array}
     */
    this.memory = [];

    /**
     * Stats
     *
     * @property
     * @type {Object}
     */
    this.stats = {
        accel: 0.7,
        jump: 30,
        speed: 20
    };

    /**
     * Entities default to higher depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 100;

    /**
     * Runs single frame
     *
     * @method run
     */
    Entity.prototype.run = function () {
        Idea.prototype.run.call(this);

        this.goal = this.goal ? this.goal : this.baseGoal;
        this.action = this.goal ? this.goal.getAction.call(this) : false;
        if (this.action)
            this.action.run.call(this, this.action.params);

        this.updateSprite();
    };

    /**
     * Set sprite based upon current action
     *
     * @method updateSprite
     */
    Entity.prototype.updateSprite = function () {
        this.sprite.frameSpeed = this.sprite.src.frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed);
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

module.exports = Entity;