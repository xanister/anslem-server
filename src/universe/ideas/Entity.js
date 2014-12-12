/**
 * Entity
 *
 * @module Anslem.Universe
 */

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
    this.categories.push('alive');
    this.categories.push('entity');
    this.categories.push('physical');

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
    this.stats = JSON.parse(JSON.stringify(UniverseConfig.defaultEntityStats));

    /**
     * Entities default to higher depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 200;

    /**
     * Generate packet of information required
     * to render the self to send to client
     *
     * @method getPacket
     * @return {Object}
     */
    Entity.prototype.getPacket = function () {
        var packet = Idea.prototype.getPacket.call(this);
        packet.shadow = false;
        return packet;
    };

    /**
     * Return savable object
     *
     * @method load
     * @param {Object} src
     */
    Entity.prototype.load = function (src) {
        Idea.prototype.load.call(this, src);
        this.baseGoal = Goals[src.baseGoal];
        this.goal = src.goal ? Goals[src.goal] : false;
        this.stats = src.stats;
        return this;
    };

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
            this.action.run.call(this, this.action.params);
            this.action.updateAnimation.call(this);
            this.action.progress++;
        }
    };

    /**
     * Return savable object
     *
     * @method toSimple
     * @returns {Object}
     */
    Entity.prototype.toSimple = function () {
        var simple = Idea.prototype.toSimple.call(this);
        simple.baseGoal = this.baseGoal.id;
        simple.stats = JSON.parse(JSON.stringify(this.stats));
        return simple;
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

Anslem.Entity = Entity;