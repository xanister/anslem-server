/**
 * Floor
 *
 * @module Anslem.Universe
 */

/**
 * Floor
 *
 * @class Floor
 * @constructor
 * @extends Idea
 */
function Floor() {
    Landscape.call(this);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('ground');

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 200;

    /*
     * Floor defaults
     */
    this.setSprite("floor01", true, false, 1);
}
Floor.prototype = new Landscape();
Floor.prototype.constructor = Floor;

Anslem.Floor = Floor;