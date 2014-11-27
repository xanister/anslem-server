/**
 * Entity
 *
 * @module Anslem.universe
 * @requires AnslemConfig, Idea, Synapse
 */
var AnslemConfig = require("./../AnslemConfig");
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
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

module.exports = Entity;