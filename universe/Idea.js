/**
 * Idea.js
 * Basic universal contruct used to define the world
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 */

/**
 * Includes
 */
var Position = require("./Position");
var Sprites = require("./Sprites");
var Synapse = require("./Synapse");
var Goals = require("./Goals");

/**
 * Basic universal construct
 * @param {Array} categories
 * @param {String} id short description
 * @returns {Idea}
 */
function Idea(categories, id) {
    /**
     * Global id counter
     * @access static
     * @var {Number}
     */
    Idea.idCounter = Idea.idCounter || 1;

    /**
     * Unique id
     * @access public
     * @var {String}
     */
    this.id = id || Idea.idCounter++;

    /**
     * Current action
     * @access public
     * @var {Action}
     */
    this.action = false;

    /**
     * Basic driving goal
     * @access public
     * @var {Goal}
     */
    this.baseGoal = false;

    /**
     * Categories
     * @access public
     * @var {Array}
     */
    this.categories = categories || [];

    /**
     * Contained objects
     * @access public
     * @var {Array}
     */
    this.contents = {0: {}};

    /**
     * Basic description
     * @access public
     * @var {String}
     */
    this.description = false;

    /**
     * Current goal
     * @access public
     * @var {Goal}
     */
    this.goal = false;

    /**
     * Short description
     * @access public
     * @var {String}
     */
    this.label = false;

    /**
     * Memories
     * @access public
     * @var {Array}
     */
    this.memory = [];

    /**
     * Basic position
     * @access public
     * @var {Position}
     */
    this.position = new Position();

    /**
     * Visual representation
     * @access public
     * @var {String}
     */
    this.sprite = false;

    /**
     * Destroy self
     */
    Idea.prototype.destoy = function () {
        delete this.position.container.contents[0][this.id];
        for (var index in this.categories) {
            delete this.position.container.contents[this.categories[index]][this.id];
        }
    };

    /**
     * Generates small object representation
     * @returns {Object}
     */
    Idea.prototype.getPacket = function () {
        var packet = {
            contents: [],
            sprite: this.sprite,
            x: this.position.x,
            y: this.position.y,
            width: this.position.width,
            height: this.position.height
        };
        for (var index in this.contents[0]) {
            packet.contents.push(this.contents[0][index].getPacket());
        }
        return packet;
    };

    /**
     *
     * @param {String} sprite
     * @param {Boolean} tileX
     * @param {Boolean} tileY
     * @param {Number} scrollSpeed
     */
    Idea.prototype.setImage = function (sprite, tileX, tileY, scrollSpeed) {
        this.sprite = {
            frame: 0,
            frameSpeed: Sprites[sprite].frameSpeed,
            image: sprite,
            tileX: tileX || false,
            tileY: tileY || false,
            scrollSpeed: scrollSpeed || 1
        };
    };

    /**
     * Runs single frame
     */
    Idea.prototype.run = function () {
        // Physics

        // AI
        this.goal = this.goal ? this.goal : this.baseGoal;
        this.action = this.goal ? this.goal.getAction.call(this) : false;
        if (this.action)
            this.action.run.call(this, this.action.params);

        // Run contents
        for (var id in this.contents[0]) {
            this.contents[0][id].run();
        }
    };

    /**
     * Warp to given coords and maintain associative lists
     * @param {Number} targetX
     * @param {Number} targetY
     * @param {Idea} container
     */
    Idea.prototype.warp = function (targetX, targetY, container) {
        if (!this.position)
            this.position = new Position();
        this.position.x = targetX;
        this.position.y = targetY;
        if (container) {
            if (this.position.container) {
                delete this.position.container.contents[0][this.id];
                for (var index in this.categories) {
                    var c = this.categories[index];
                    delete this.position.container.contents[c][this.id];
                }
            }
            this.position.container = container;
            this.position.container.contents[0][this.id] = this;
            for (var index in this.categories) {
                var c = this.categories[index];
                if (!this.position.container.contents[c])
                    this.position.container.contents[c] = {};
                this.position.container.contents[c][this.id] = this;
            }
        }
    };
}

module.exports = Idea;