/**
 * Ground
 *
 * @module Anslem.Universe
 */

/**
 * Ground
 *
 * @class Ground
 * @constructor
 * @extends Idea
 */
function Ground() {
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
     * Ground defaults
     */
    this.setSprite("grass03", true, false, 1);
}
Ground.prototype = new Landscape();
Ground.prototype.constructor = Ground;

Anslem.Ground = Ground;