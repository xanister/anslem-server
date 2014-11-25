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
     * Falling speed
     * @access public
     * @var {Number}
     */
    this.gravity = 0;

    /**
     * Short description
     * @access public
     * @var {String}
     */
    this.label = false;

    /**
     * Slow in x direction
     * @access public
     * @var {Number}
     */
    this.linerDampening = 0.5;

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
     * Horizontal speed
     * @access public
     * @var {Number}
     */
    this.xSpeed = 0;

    /**
     * Vertical speed
     * @access public
     * @var {Number}
     */
    this.ySpeed = 0;

    /**
     * Return bounding box
     * @access public
     * @returns {Object}
     */
    Idea.prototype.bbox = function () {
        return {
            left: this.position.x - (this.position.width / 2),
            right: this.position.x + (this.position.width / 2),
            top: this.position.y - (this.position.height / 2),
            bottom: this.position.y + (this.position.height / 2)
        };
    };


    /**
     * Returns true if self collides with given bbox
     * @param {Object} bbox
     * @returns {Boolean}
     */
    Idea.prototype.collides = function (bbox) {
        var rect1 = this.bbox();
        var rect2 = bbox;
        return (
                rect1.left < rect2.right &&
                rect1.right > rect2.left &&
                rect1.top < rect2.bottom &&
                rect1.bottom > rect2.top
                );
    };

    /**
     * Destroy self
     */
    Idea.prototype.destroy = function () {
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
     * Return idea that collides at given position
     * @param {String} category
     * @param {Number} x
     * @param {Number} y
     * @returns {Idea}
     */
    Idea.prototype.instancePlace = function (category, x, y) {
        var oldX = this.position.x;
        var oldY = this.position.y;
        category = category || 0;
        this.position.x = x || this.position.x;
        this.position.y = y || this.position.y;
        for (var id in this.position.container.contents[category]) {
            var e = this.position.container.contents[category][id];
            if (e.id !== this.id && this.collides(e.bbox())) {
                this.x = oldX;
                this.y = oldY;
                return e;
            }
        }
        this.x = oldX;
        this.y = oldY;
        return false;
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
        if (this.gravity > 0) {
            if (this.position.y + (this.position.height / 2) + this.gravity < this.position.container.position.height)
                this.ySpeed += this.gravity;
            else
                this.y = this.position.container.position.height - (this.position.height / 2);
            this.xSpeed -= (this.xSpeed > 0 ? this.linerDampening : -this.linerDampening);
            this.position.x += this.xSpeed;
            if (Math.abs(this.xSpeed) <= this.linerDampening)
                this.xSpeed = 0;
        }

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