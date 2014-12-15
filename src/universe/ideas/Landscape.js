/**
 * Landscape
 *
 * @module Anslem.Universe
 */

/**
 * Landscape
 *
 * @class Landscape
 * @constructor
 * @extends Idea
 */
function Landscape() {
    Idea.call(this);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('landscape');

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 1;

    /*
     * Landscape defaults
     */
    this.setSprite("mountains01", true, false, 0.1);
}
Landscape.prototype = new Idea();
Landscape.prototype.constructor = Landscape;

Anslem.Landscape = Landscape;