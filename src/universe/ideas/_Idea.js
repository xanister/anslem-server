/**
 * Basic universal contruct used to define the world
 *
 * @module Anslem.Universe
 */

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
     * Object below, for physics/shadows
     *
     * @property below
     * @type {Idea}
     */
    this.below = false;

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
     * Has the idea changed this frame
     *
     * @property changed
     * @type {Boolean}
     */
    this.changed = false;


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
    this.linearDampening = UniverseConfig.linearDampening;

    /**
     * On solid object
     *
     * @property onSolid
     * @type {Object|Boolean}
     */
    this.onSolid = false;

    /**
     * Unique slug
     *
     * @property slug
     * @type {String}
     */
    this.slug = "idea" + this.id;

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
     * Create associations
     *
     * @method associate
     */
    Idea.prototype.associate = function () {
        for (var id in this.contents[0])
            this.contents[0][id].associate();
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
     * @param {Idea} idea
     * @return {Boolean}
     */
    Idea.prototype.collides = function (idea) {
        return (
                this.x - (this.width / 2) < idea.x + (idea.width / 2) &&
                idea.x - (idea.width / 2) < this.x + (this.width / 2) &&
                this.y - (this.height / 2) < idea.y + (idea.height / 2) &&
                idea.y - (idea.height / 2) < this.y + (this.height / 2)
                );
    };

    /**
     * Returns true if self collides with given bbox
     *
     * @method collides
     * @param {Number} left
     * @param {Number} top
     * @param {Number} right
     * @param {Number} bottom
     * @return {Boolean}
     */
    Idea.prototype.collidesRect = function (left, top, right, bottom) {
        return (
                this.x - (this.width / 2) < right &&
                left < this.x + (this.width / 2) &&
                this.y - (this.height / 2) < bottom &&
                top < this.y + (this.height / 2)
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
        delete Population[this.id];
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
     * Find idea inside
     *
     * @method findById
     * @param {Number} id
     * @returns {Idea}
     */
    Idea.prototype.findById = function (id) {
        if (this.id === id)
            return this;
        for (var id in this.contents[0]) {
            var r = this.contents[0][id].findById(id);
            if (r)
                return r;
        }
        return false;
    };

    /**
     * Find idea inside
     *
     * @method findBySlug
     * @param {String} slug
     * @returns {Idea}
     */
    Idea.prototype.findBySlug = function (slug) {
        if (this.slug === slug)
            return this;
        for (var id in this.contents[0]) {
            var r = this.contents[0][id].findBySlug(slug);
            if (r)
                return r;
        }
        return false;
    };

    /**
     * Generate small packet
     *
     * @method getPacket
     * @return {Object}
     */
    Idea.prototype.getPacket = function () {
        var packet = {
            bubble: this.bubble,
            id: this.id,
            sprite: {
                name: this.sprite.name,
                scrollSpeed: this.sprite.scrollSpeed
            },
            width: this.sprite.src[this.sprite.animation].width,
            height: this.sprite.src[this.sprite.animation].height,
            x: this.x + (this.sprite.src[this.sprite.animation].xOffset * this.facing),
            y: this.y + this.sprite.src[this.sprite.animation].yOffset,
            z: this.z
        };
        if (this.sprite.animation !== "default")
            packet.sprite.animation = this.sprite.animation;
        if (this.sprite.frame !== 0)
            packet.sprite.frame = Math.floor(this.sprite.frame);
        if (this.facing !== 1)
            packet.sprite.mirror = true;
        if (this.sprite.tint)
            packet.sprite.tint = this.sprite.tint;
        if (this.sprite.tileX)
            packet.sprite.tileX = this.sprite.tileX;
        if (this.sprite.tileY)
            packet.sprite.tileY = this.sprite.tileY;

        return packet;
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
            var idea = this.container.contents[category][id];
            if (idea.id !== this.id && (
                    this.x - (this.width / 2) < idea.x + (idea.width / 2) &&
                    idea.x - (idea.width / 2) < this.x + (this.width / 2) &&
                    this.y - (this.height / 2) < idea.y + (idea.height / 2) &&
                    idea.y - (idea.height / 2) < this.y + (this.height / 2)
                    )) {
                this.x = oldX;
                this.y = oldY;
                return idea;
            }
        }
        this.x = oldX;
        this.y = oldY;
        return false;
    };

    /**
     * Return idea that collides at given point
     *
     * @method instancePoint
     * @param {String} category
     * @param {Number} x
     * @param {Number} y
     * @return {Idea}
     */
    Idea.prototype.instancePoint = function (category, x, y) {
        for (var id in this.container.contents[category]) {
            var bbox = this.container.contents[category][id].bbox();
            if (x > bbox.left && x < bbox.right && y > bbox.top && y < bbox.bottom)
                return this.container.contents[category][id];
        }
        return false;
    };

    /**
     * Return idea that collides at given rect
     *
     * @method instanceRect
     * @param {String} category
     * @param {Object} r {left: {Number}, right: {Number}, top: {Number}, bottom: {Number}}
     * @return {Idea}
     */
    Idea.prototype.instanceRect = function (category, r) {
        for (var id in this.container.contents[category]) {
            var e = this.container.contents[category][id];
            if (e.collidesRect(r.left, r.top, r.right, r.bottom))
                return e;
        }
        return false;
    };

    /**
     * Return ideas that collides at given rect
     *
     * @method instancesRect
     * @param {String} category
     * @param {Object} r {left: {Number}, right: {Number}, top: {Number}, bottom: {Number}}
     * @return {Array}
     */
    Idea.prototype.instancesRect = function (category, r) {
        var toReturn = [];
        for (var id in this.container.contents[category]) {
            var e = this.container.contents[category][id];
            if (e.collidesRect(r.left, r.top, r.right, r.bottom))
                toReturn.push(e);
        }
        return toReturn;
    };

    /**
     * Recreate from object
     *
     * @method fromSimple
     * @param {Object} src
     */
    Idea.prototype.fromSimple = function (src) {
        console.log("creating " + src.label);
        this.categories = src.categories;
        this.description = src.description;
        this.facing = src.facing;
        this.gravity = src.gravity;
        this.label = src.label;
        this.linearDampening = src.linearDampening;
        this.slug = src.slug;
        if (src.sprite)
            this.setSprite(src.sprite.name, src.sprite.tileX, src.sprite.tileY, src.sprite.scrollSpeed);
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;

        delete Population[this.id];
        this.id = src.id;
        Population[this.id] = this;

        for (var index in src.contents) {
            var t = src.contents[index].type;
            if (t !== "Player") {
                var n = new Anslem[t]();
                n.fromSimple(src.contents[index]);
                n.warp(n.x, n.y, this);
            }
        }

        return this;
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
        if (this.container && this.container.contents[category] && this.container.contents[category][this.id])
            delete this.container.contents[category][this.id];
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Idea.prototype.run = function () {
        // Maintain check for change
        var oldX = this.x;
        var oldY = this.y;
        var oldSpriteFrame = this.sprite.frame;
        this.changed = false;

        if (this.immunityTimeout > 0)
            this.immunityTimeout--;

        // Physics
        if (this.gravity > 0)
            this.updatePhysics();

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

        // Keep track of changed
        this.changed = (this.x !== oldX || this.y !== oldY || this.sprite.frame !== oldSpriteFrame);
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
            tileY: tileY || false,
            tint: 0xFFFFFF
        };
        this.width = Sprites[sprite]["default"].width - (Sprites[sprite]["default"].leftOffset + Sprites[sprite]["default"].rightOffset);
        this.height = Sprites[sprite]["default"].height - (Sprites[sprite]["default"].topOffset + Sprites[sprite]["default"].bottomOffset);
    };

    /**
     * Recursive size, number of contents
     *
     * @method size
     */
    Idea.prototype.size = function () {
        var count = 1;
        for (var index in this.contents[0]) {
            count += this.contents[0][index].size();
        }
        return count;
    };

    /**
     * Return savable object
     *
     * @method toSimple
     * @returns {Object}
     */
    Idea.prototype.toSimple = function () {
        var simple = {
            categories: this.categories,
            container: this.container.id,
            contents: [],
            description: this.description,
            facing: this.facing,
            gravity: this.gravity,
            id: this.id,
            label: this.label,
            linearDampening: this.linearDampening,
            slug: this.slug,
            sprite: this.sprite ? {
                name: this.sprite.name,
                tileX: this.sprite.tileX,
                tileY: this.sprite.tileY,
                scrollSpeed: this.sprite.scrollSpeed
            } : false,
            type: this.constructor.name,
            x: this.x,
            y: this.y,
            z: this.z
        };

        for (var id in this.contents[0]) {
            simple.contents.push(this.contents[0][id].toSimple());
        }

        return simple;
    };

    /**
     * Update physics
     * TODO: Optimize optimize optimize
     *
     * @method updatePhysics
     */
    Idea.prototype.updatePhysics = function () {
        this.onSolid = false;

        // Vertical
        this.ySpeed += this.gravity;
        this.y += this.ySpeed;
        if (this.y + (this.height / 2) >= this.container.innerHeight - this.container.buffer.bottom) {
            this.y = this.container.innerHeight - this.container.buffer.bottom - (this.height / 2);
            this.ySpeed = 0;
            this.onSolid = true;
        } else {
            var collides = this.instancePlace("solid");
            if (collides) {
                if (this.ySpeed > 0) {
                    this.y = collides.y - (collides.height / 2) - (this.height / 2);
                    this.onSolid = collides;
                } else {
                    this.y = collides.y + (collides.height / 2) + (this.height / 2);
                }

                this.ySpeed = 0;
            }
            if (this.y < 0) {
                this.y = 0;
                this.ySpeed = 0;
            }
        }

        // Horizontal
        if (this.xSpeed >= -this.linearDampening && this.xSpeed <= this.linearDampening)
            this.xSpeed = 0;
        if (this.xSpeed !== 0) {
            this.xSpeed -= (this.xSpeed > 0 ? this.linearDampening : -this.linearDampening);
            this.x += this.xSpeed;

            var collides = this.instancePlace("solid");
            if (collides) {
                this.x = (this.xSpeed > 0 ? (collides.x - (this.width / 2) - (collides.width / 2)) : (collides.x + (this.width / 2) + (collides.width / 2)));
                this.xSpeed = 0;
            }

            if (this.x < 0) {
                this.xSpeed = 0;
                this.x = 0;
                if (this.container.container) {
                    this.warp(this.container.x, this.container.y, this.container.container);
                }
            } else if (this.x > this.container.innerWidth) {
                this.xSpeed = 0;
                this.x = this.container.innerWidth;
            }
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
        console.log("warping " + this.slug + (container ? " to " + container.slug : ""));

        this.changed = true;

        this.x = targetX;
        this.y = targetY;
        if (container) {
            // Clear from curent container
            if (this.container.categories) {
                delete this.container.contents[0][this.id];
                for (var index in this.categories) {
                    var c = this.categories[index];
                    delete this.container.contents[c][this.id];
                }
            }

            // Add to new container
            if (this.container && container.portOffset !== this.container.portOffset) {
                // Different region server
                var regionAddress = AnslemServerConfig.serverAddress + ":" + (AnslemServerConfig.port + container.portOffset);
                console.log("transferring " + this.slug + " to " + regionAddress);
                var socket = require('socket.io-client')("http://" + regionAddress, {
                    'forceNew': true,
                    'sync disconnect on unload': true
                });
                var self = this;
                socket.on('connect', function () {
                    console.log("connected to " + regionAddress);
                    socket.emit("warp", {idea: self.toSimple(), regionSlug: container.slug, x: targetX, y: targetY});
                    if (self.client) {
                        self.client.emit("forward", regionAddress);
                    }
                    socket.disconnect();
                });
            } else {
                // Same region server
                this.container = container;
                this.container.contents[0][this.id] = this;
                for (var index in this.categories) {
                    var c = this.categories[index];
                    if (!this.container.contents[c])
                        this.container.contents[c] = {};
                    this.container.contents[c][this.id] = this;
                }
            }
        }
    };

    Population[this.id] = this;
}

Anslem.Idea = Idea;