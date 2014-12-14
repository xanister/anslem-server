/**
 * Door
 *
 * @module Anslem.Universe
 */

/**
 * Door
 *
 * @class Door
 * @constructor
 * @extends Idea
 */
function Door() {
    Idea.call(this);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('activatable');
    this.categories.push('door');
    this.categories.push('visible');

    /**
     * Target door
     *
     * @property targetDoor
     * @type {Door}
     */
    this.targetDoor = false;

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 100;

    /**
     * Activate object
     *
     * @method activate
     * @param {Idea} src
     */
    this.activate = function (src) {
        if (this.targetDoor) {
            if (src.client)
                src.client.trigger("transition", {start: "pt-page-moveFromBottom", end: ""});
            src.warp(this.targetDoor.x, this.targetDoor.y, this.targetDoor.container);
        }
    };

    /**
     * Create associations
     *
     * @method associate
     */
    Door.prototype.associate = function () {
        Idea.prototype.associate.call(this);
        this.targetDoor = Population[this.targetDoor];
    };

    /**
     * Return savable object
     *
     * @method load
     * @param {Object} src
     */
    Door.prototype.load = function (src) {
        Idea.prototype.load.call(this, src);
        this.targetDoor = src.targetDoor;
        return this;
    };

    /**
     * Return savable object
     *
     * @method toSimple
     * @returns {Object}
     */
    Door.prototype.toSimple = function () {
        var simple = Idea.prototype.toSimple.call(this);
        simple.targetDoor = this.targetDoor.id;

        return simple;
    };

    /*
     * Door defaults
     */
    this.setSprite("door01");
}
Door.prototype = new Idea();
Door.prototype.constructor = Door;

Anslem.Door = Door;