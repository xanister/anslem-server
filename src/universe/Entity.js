/**
 * Entity
 *
 * @module Anslem.Universe
 * @requires UniverseConfig, Idea, Synapse
 */
var Goals = require("./celia.compiled");
var Idea = require("./Idea");
var Synapse = require("./Synapse");
var UniverseConfig = require("./UniverseConfig");

/**
 * Entity
 *
 * @class Entity
 * @constructor
 * @extends Idea
 */
function Entity() {
    Idea.call(this);
    /**
     * Current action
     *
     * @property action
     * @type {Action}
     */
    this.action = false;

    /**
     * Conscious
     *
     * @property alive
     * @type {Boolean}
     */
    this.alive = true;

    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = Goals.EatBrains;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories = ['physical', 'entity', 'aware'];

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
    this.gravity = UniverseConfig.gravity;

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
        accel: 1.8,
        health: 100,
        perception: 800,
        jump: 50,
        speed: 10,
        strength: 25
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

        this.inView = [];
        if (this.container) {
            for (var id in this.container.contents[0]) {
                var idea = this.container.contents[0][id];
                if (idea.hasCategory('landscape') || this.distanceTo(idea.x, idea.y) < this.stats.perception) {
                    this.inView.push(idea);
                }
            }
        }

        if (this.stats.health <= 0) {
            this.baseGoal = Goals.Dead;
            this.action = false;
        }
        if (!this.action || this.action.progress >= this.action.speed)
            this.action = this.baseGoal.getAction.call(this);
        if (this.action) {
            this.action.updateAnimation.call(this);
            this.action.run.call(this, this.action.params);
            this.action.progress++;
        }
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

module.exports = Entity;
