/**
 * Basic universal contruct used to define the world
 *
 * @module Anslem.Universe
 * @requires Sprites
 */
var Sprites = require("./Sprites");
var UniverseConfig = require("./UniverseConfig");

/**
 * Global id counter
 *
 * @property idCounter
 * @type {Number}
 */
global.idCounter = global.idCounter || 1;

/**
 * Basic universal construct
 *
 * @class Idea
 * @constructor
 * @param {Array} categories
 */
function Idea(categories) {
    /**
     * Bubble for speech/emotes
     *
     * @property bubble
     * @type {Object}
     */
    this.bubble = false;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories = categories || [];

    /**
     * Parent object
     *
     * @property container
     * @type {Idea}
     */
    this.container = false;

    /**
     * Contained objects
     *
     * @property contents
     * @type {Array}
     */
    this.contents = {0: {}};

    /**
     * Basic description
     *
     * @property description
     * @type {String}
     */
    this.description = false;

    /**
     * Current facing direction, 1 right, -1 left
     *
     * @property facing
     * @type {Number}
     */
    this.facing = 1;

    /**
     * Falling speed
     *
     * @property gravity
     * @type {Number}
     */
    this.gravity = 0;

    /**
     * Unique id
     *
     * @property id
     * @type {String}
     */
    this.id = global.idCounter++;

    /**
     * Temp immunity, frames left
     *
     * @property immunityTimeout
     * @type {Number}
     */
    this.immunityTimeout = 0;

    /**
     * Short description
     *
     * @property label
     * @type {String}
     */
    this.label = false;

    /**
     * Slow in x direction
     *
     * @property linearDampening
     * @type {Number}
     */
    this.linerDampening = UniverseConfig.linearDampening;

    /**
     * Visual representation
     *
     * @property sprite
     * @type {Object}
     */
    this.sprite = false;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 0;

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 0;

    /**
     * Local x coord
     *
     * @property x
     * @type {Number}
     */
    this.x = 0;

    /**
     * Local y coord
     *
     * @property y
     * @type {Number}
     */
    this.y = 0;

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 0;

    /**
     * Horizontal speed
     *
     * @property xSpeed
     * @type {Number}
     */
    this.xSpeed = 0;

    /**
     * Vertical speed
     *
     * @property ySpeed
     * @type {Number}
     */
    this.ySpeed = 0;

    /**
     * Add category
     *
     * @method addCategory
     * @param {String} category
     * @return {Boolean}
     */
    Idea.prototype.addCategory = function (category) {
        for (var index in this.categories)
            if (this.categories[index] === category)
                return true;
        this.categories.push(category);
        if (!this.container.contents[category])
            this.container.contents[category] = {};
        this.container.contents[category][this.id] = this;
        return true;
    };

    /**
     * Return bounding box
     *
     * @method bbox
     * @return {Object}
     */
    Idea.prototype.bbox = function () {
        return {
            left: this.x - (this.width / 2),
            right: this.x + (this.width / 2),
            top: this.y - (this.height / 2),
            bottom: this.y + (this.height / 2)
        };
    };


    /**
     * Returns true if self collides with given bbox
     *
     * @method collides
     * @param {Object} bbox
     * @return {Boolean}
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
     *
     * @method describe
     * @param {Array} categories
     * @param {String} label
     * @param {String} description
     * @param {String} sprite
     * @param {Number} gravity
     */
    Idea.prototype.describe = function (categories, label, description, sprite, gravity) {
        this.categories = categories || this.categories;
        this.label = label;
        this.description = description || this.description;
        if (sprite)
            this.setSprite(sprite);
        this.gravity = gravity || this.gravity;
    };

    /**
     * Destroy self
     *
     * @method destroy
     */
    Idea.prototype.destroy = function () {
        if (!this.container)
            return false;
        delete this.container.contents[0][this.id];
        for (var index in this.categories) {
            delete this.container.contents[this.categories[index]][this.id];
        }
    };

    /**
     * Return distanct to point
     *
     * @method distanceTo
     * @param {Number} tarX
     * @param {Number} tarY
     * @return {Number}
     */
    Idea.prototype.distanceTo = function (tarX, tarY) {
        return Math.sqrt(Math.pow(tarX - this.x, 2) + Math.pow(tarY - this.y, 2));
    };

    /**
     * Generate small packet
     *
     * @method getPacket
     * @return {Object}
     */
    Idea.prototype.getPacket = function () {
        return {
            bubble: this.bubble,
            id: this.id,
            sprite: {
                animation: this.sprite.animation,
                frame: Math.floor(this.sprite.frame),
                mirror: this.facing,
                name: this.sprite.name,
                scrollSpeed: this.sprite.scrollSpeed,
                tileX: this.sprite.tileX,
                tileY: this.sprite.tileY,
                width: this.sprite.src[this.sprite.animation].width,
                height: this.sprite.src[this.sprite.animation].height
            },
            width: this.width,
            height: this.height,
            x: this.x + (this.sprite.src[this.sprite.animation].xOffset * this.facing),
            y: this.y + this.sprite.src[this.sprite.animation].yOffset,
            z: this.z
        };
    };

    /**
     * Returns true if Idea has the given category
     *
     * @method hasCategory
     * @param {String} category
     * @return {Boolean}
     */
    Idea.prototype.hasCategory = function (category) {
        for (var index in this.categories)
            if (this.categories[index] === category)
                return true;
        return false;
    };

    /**
     * Return idea closest to given point
     *
     * @method instanceNearest
     * @param {String} category
     * @param {Number} x
     * @param {Number} y
     * @return {Idea}
     */
    Idea.prototype.instanceNearest = function (category, x, y) {
        category = category || 0;
        this.x = x || this.x;
        this.y = y || this.y;
        var nearest = false;
        var dist = 1000000;
        for (var id in this.container.contents[category]) {
            var e = this.container.contents[category][id];
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
     * Return idea that collides at given position
     *
     * @method instancePlace
     * @param {String} category
     * @param {Number} x
     * @param {Number} y
     * @return {Idea}
     */
    Idea.prototype.instancePlace = function (category, x, y) {
        var oldX = this.x;
        var oldY = this.y;
        category = category || 0;
        this.x = x || this.x;
        this.y = y || this.y;
        for (var id in this.container.contents[category]) {
            var e = this.container.contents[category][id];
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
     * Remove category
     *
     * @method removeCategory
     * @param {String} category
     * @return {Boolean}
     */
    Idea.prototype.removeCategory = function (category) {
        for (var index in this.categories)
            if (this.categories[index] === category)
                this.categories.splice(index, 1);
        if (this.container)
            delete this.container.contents[category][this.id];
    };

    /**
     * Sets Animation
     *
     * @method setAnimation
     * @param {String} animation
     * @param {Number} [frameSpeed=Sprite.frameSpeed]
     */
    Idea.prototype.setAnimation = function (animation, frameSpeed) {
        if (!this.sprite.src[animation]) {
            animation = "default";
        }
        this.sprite.frameSpeed = frameSpeed || this.sprite.src[animation].frameSpeed;
        if (this.sprite.animation === animation)
            return false;
        this.sprite.animation = animation;
        this.sprite.frame = 0;
        this.sprite.frameCount = this.sprite.src[animation].frameCount;
        this.sprite.loop = this.sprite.src[animation].loop;
    };

    /**
     * Sets categories and maintains associations
     *
     * @method setCategories
     * @param {Array} categories
     */
    Idea.prototype.setCategories = function (categories) {
        if (this.container) {
            for (var index in this.categories) {
                var c = this.categories[index];
                delete this.container.contents[c][this.id];
            }
            this.categories = categories;
            for (var index in this.categories) {
                var c = this.categories[index];
                if (!this.container.contents[c])
                    this.container.contents[c] = {};
                this.container.contents[c][this.id] = this;
            }
        } else {
            this.categories = categories;
        }
    };

    /**
     * Sets image
     *
     * @method setSprite
     * @param {String} sprite
     * @param {Boolean} tileX
     * @param {Boolean} tileY
     * @param {Number} scrollSpeed
     */
    Idea.prototype.setSprite = function (sprite, tileX, tileY, scrollSpeed) {
        this.sprite = {
            animation: "default",
            frame: 0,
            frameCount: Sprites[sprite]["default"].frameCount,
            frameSpeed: Sprites[sprite]["default"].frameSpeed,
            loop: Sprites[sprite]["default"].loop,
            name: sprite,
            src: Sprites[sprite],
            scrollSpeed: scrollSpeed || 1,
            tileX: tileX || false,
            tileY: tileY || false
        };
        this.width = Sprites[sprite]["default"].width;
        this.height = Sprites[sprite]["default"].height;
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Idea.prototype.run = function () {
        // Physics
        if (this.immunityTimeout > 0)
            this.immunityTimeout--;
        if (this.gravity > 0) {
            this.ySpeed += this.gravity;
            this.y += this.ySpeed;
            if (this.y > (this.container.height - this.container.buffer.bottom - (this.height / 2))) {
                this.ySpeed = 0;
                this.y = this.container.height - this.container.buffer.bottom - (this.height / 2);
            }

            this.xSpeed -= (this.xSpeed > 0 ? this.linerDampening : -this.linerDampening);
            if (Math.abs(this.xSpeed) <= this.linerDampening)
                this.xSpeed = 0;
            this.x += this.xSpeed;
            if (this.x < 0) {
                this.xSpeed = 0;
                this.x = 0;
            } else if (this.x > this.container.width) {
                this.xSpeed = 0;
                this.x = this.container.width;
            }
        }

        // Sprite
        if (this.sprite && this.sprite.frameSpeed > 0) {
            this.sprite.frame += this.sprite.frameSpeed;
            if (this.sprite.frame >= this.sprite.frameCount) {
                if (this.sprite.loop)
                    this.sprite.frame = 0;
                else
                    this.sprite.frame = this.sprite.frameCount - 1;
            }
        }

        // Bubble
        if (this.bubble && this.bubble.time-- <= 0)
            this.bubble = false;

        // Run contents
        for (var id in this.contents[0]) {
            this.contents[0][id].run();
        }
    };

    /**
     * Warp to given coords and maintain associative lists
     *
     * @method warp
     * @param {Number} targetX
     * @param {Number} targetY
     * @param {Idea} container
     */
    Idea.prototype.warp = function (targetX, targetY, container) {
        this.x = targetX;
        this.y = targetY;
        if (container) {
            if (this.container) {
                delete this.container.contents[0][this.id];
                for (var index in this.categories) {
                    var c = this.categories[index];
                    delete this.container.contents[c][this.id];
                }
            }
            this.container = container;
            this.container.contents[0][this.id] = this;
            for (var index in this.categories) {
                var c = this.categories[index];
                if (!this.container.contents[c])
                    this.container.contents[c] = {};
                this.container.contents[c][this.id] = this;
            }
        }
    };
}

module.exports = Idea;
