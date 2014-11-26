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
 * @param {String} id
 * @returns {Idea}
 */
function Idea(id) {
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
    this.categories = [];

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
     * Current focus position x
     * @access public
     * @var {Number}
     */
    this.focusX = 0;

    /**
     * Current focus position y
     * @access public
     * @var {Number}
     */
    this.focusY = 0;

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
    this.linerDampening = 0.25;

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
     * Sets common attributes
     * @param {Array} categories
     * @param {String} label
     * @param {String} description
     * @param {String} sprite
     * @param {Number} gravity
     * @param {Goal} baseGoal
     */
    Idea.prototype.describe = function (categories, label, description, sprite, gravity, baseGoal) {
        this.categories = categories || this.categories;
        this.label = label;
        this.description = description || this.description;
        if (sprite)
            this.setSprite(sprite);
        this.gravity = gravity || this.gravity;
        this.baseGoal = baseGoal || this.baseGoal;
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

            , // Bigger packet for debugging
            gravity: this.gravity,
            containerHeight: this.position.container ? this.position.container.position.height : 0
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
                this.position.x = oldX;
                this.position.y = oldY;
                return e;
            }
        }
        this.position.x = oldX;
        this.position.y = oldY;
        return false;
    };

    /**
     *
     * @param {String} sprite
     * @param {Boolean} tileX
     * @param {Boolean} tileY
     * @param {Number} scrollSpeed
     */
    Idea.prototype.setSprite = function (sprite, tileX, tileY, scrollSpeed) {
        this.sprite = {
            frame: 0,
            frameSpeed: Sprites[sprite].frameSpeed,
            frameCount: Sprites[sprite].frameCount,
            image: sprite,
            tileX: tileX || false,
            tileY: tileY || false,
            scrollSpeed: scrollSpeed || 1
        };
        if (this.position.width === 0)
            this.position.width = Sprites[sprite].width;
        if (this.position.height === 0)
            this.position.height = Sprites[sprite].height;
    };

    /**
     * Runs single frame
     */
    Idea.prototype.run = function () {
        // Physics
        if (this.gravity > 0) {
            if ((this.position.y + this.gravity) < (this.position.container.position.height - (this.position.height / 2))) {
                this.ySpeed += this.gravity;
                this.position.y += this.ySpeed;
            } else {
                this.ySpeed = 0;
                this.position.y = this.position.container.position.height - (this.position.height / 2);
            }

            this.xSpeed -= (this.xSpeed > 0 ? this.linerDampening : -this.linerDampening);
            if (Math.abs(this.xSpeed) <= this.linerDampening)
                this.xSpeed = 0;
            this.position.x += this.xSpeed;
            if (this.position.x < 0) {
                this.xSpeed = 0;
                this.position.x = 0;
            } else if (this.position.x > this.position.container.position.width) {
                this.xSpeed = 0;
                this.position.x = this.position.container.position.width;
            }
        }

        // AI
        this.goal = this.goal ? this.goal : this.baseGoal;
        this.action = this.goal ? this.goal.getAction.call(this) : false;
        if (this.action)
            this.action.run.call(this, this.action.params);

        // Sprite
        if (this.sprite && this.sprite.frameSpeed > 0) {
            this.sprite.frame += this.sprite.frameSpeed;
            if (this.sprite.frame >= this.sprite.frameCount)
                this.sprite.frame = 0;
        }

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