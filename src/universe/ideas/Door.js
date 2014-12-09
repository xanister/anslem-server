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
        if (this.targetDoor)
            src.warp(this.targetDoor.x, this.targetDoor.y, this.targetDoor.container);
    };

    /*
     * Door defaults
     */
    this.setSprite("door01");
}
Door.prototype = new Idea();
Door.prototype.constructor = Door;

Anslem.Door = Door;