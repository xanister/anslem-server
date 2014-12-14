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
    this.categories.push('visible');

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 50;

    /*
     * Landscape defaults
     */
    this.setSprite("grass01", true, false, 1);
}
Landscape.prototype = new Idea();
Landscape.prototype.constructor = Landscape;

Anslem.Landscape = Landscape;