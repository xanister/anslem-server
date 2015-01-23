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
    this.categories.push('visible');

    /**
     * Entity's current focus
     *
     * @property focus
     * @type {Object}
     */
    this.focus = false;

    /**
     * Entity gender
     *
     * @property gender
     * @type {String}
     */
    this.gender = false;

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
     * Something changed
     *
     * @property interrupt
     * @type {Boolean}
     */
    this.interrupt = false;

    /**
     * Object in view
     *
     * @property inView
     * @type {Array}
     */
    this.inView = {0: {}};

    this.inViewAdded = [];
    this.inViewChanged = [];
    this.inViewRemoved = [];

    /**
     * In view update interval
     *
     * @property inViewUpdateDelay
     * @type {Number}
     */
    this.inViewUpdateDelay = (this.id + 1000) % UniverseConfig.inViewUpdateDelay;

    /**
     * Memories
     *
     * @property memory
     * @type {Array}
     */
    this.memory = [];

    /**
     * Objects just noticed
     *
     * @property inViewAdded
     * @type {Array}
     */
    this.inViewAdded = {0: {}};

    /**
     * Objects just lost track of
     *
     * @property inViewRemoved
     * @type {Array}
     */
    this.inViewRemoved = {0: {}};

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
    this.z = 350;

    /**
     * Create from simple object
     *
     * @method fromSimple
     * @param {Object} src
     */
    Entity.prototype.fromSimple = function (src) {
        Idea.prototype.fromSimple.call(this, src);
        this.baseGoal = Goals[src.baseGoal];
        this.goal = src.goal ? Goals[src.goal] : false;
        this.stats = src.stats;
        return this;
    };

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
     * Return idea closest to given point
     *
     * @method instanceNearest
     * @param {String} category
     * @param {Number} x
     * @param {Number} y
     * @param {Boolean} includeDistant search outside of view
     * @return {Idea}
     */
    Entity.prototype.instanceNearest = function (category, x, y, includeDistant) {
        category = category || 0;
        this.x = x || this.x;
        this.y = y || this.y;
        if (includeDistant)
            return Idea.prototype.instanceNearest.call(this, category, x, y);
        var nearest = false;
        var dist = 1000000;
        for (var id in this.inView[category]) {
            var e = this.inView[category][id];
            if (e.id !== this.id) {
                var thisDist = this.distanceTo(e.x, e.y);
                if (thisDist < dist) {
                    nearest = e;
                    dist = thisDist;
                }
            }
        }
        return nearest;
    };

    /**
     * Generate random name
     *
     * @method getRandomName
     * @returns {String}
     */
    Entity.prototype.getRandomName = function () {
        var names = ["Pat", "Sam", "Elliot"];
        if (this.gender === "male") {
            names = ["Cliff", "Norm", "Sam", "Paul", "Woody", "Coach"];
        } else if (this.gender === "female") {
            names = ["Carla", "Diane", "Rebecca", "Serafina", "Loretta"];
        }
        return names[Math.floor(Math.random * names.length)];
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Entity.prototype.run = function () {
        Idea.prototype.run.call(this);

        // Update in view periodically
        this.updateInView();

        // Handle interupts
        if (this.inViewAdded.length > 0 || this.inViewRemoved.length > 0) {
            this.interrupt = true;
        }

        // Get new action if needed
        if (this.baseGoal !== Goals.Dead && this.stats.health <= 0) {
            this.action = new Actions.Die();
        } else if (!this.action || this.action.progress >= this.action.speed) {
            this.goal = (this.interrupt || !this.goal ? this.baseGoal : this.goal);
            this.action = this.goal ? this.goal.getAction.call(this) : false;
        }

        // Run the action
        if (this.action) {
            this.action.run.call(this, this.action.params);
            this.action.updateAnimation.call(this);
            this.action.progress++;
        }

        // Reset interrupt
        this.interrupt = false;
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

    /**
     * Update in view
     *
     * @method updateInView
     */
    Entity.prototype.updateInView = function () {
        this.inViewAdded = [];
        this.inViewChanged = [];
        this.inViewRemoved = [];
        if (this.container) {
            var newInView = {0: {}};
            for (var id in this.container.contents.visible) {
                var idea = this.container.contents.visible[id];
                if (idea.sprite.tileX || (this.distanceTo(idea.x, idea.y) < this.stats.perception)) {
                    if (!this.inView[0][idea.id])
                        this.inViewAdded.push(idea);
                    else {
                        if (idea.changed || this.stats.godmode)
                            this.inViewChanged.push(idea);
                        delete this.inView[0][idea.id];
                    }
                    newInView[0][idea.id] = idea;
                    for (var index in idea.categories) {
                        if (!newInView[idea.categories[index]])
                            newInView[idea.categories[index]] = {};
                        newInView[idea.categories[index]][idea.id] = idea;
                    }
                }
            }
            for (var id in this.inView[0]) {
                if (this.inView.visible && this.inView.visible[id])
                    this.inViewRemoved.push(this.inView[0][id]);
            }
            this.inView = newInView;
        }
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

Anslem.Entity = Entity;