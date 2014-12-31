/**
 * House01
 *
 * @module Anslem.Universe
 */

/**
 * House01
 *
 * @class House01
 * @constructor
 * @extends Idea
 */
function House01() {
    Landscape.call(this);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('building', 'house');

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 100;

    /*
     * House01 defaults
     */
    this.setSprite("house01");
}
House01.prototype = new Landscape();
House01.prototype.constructor = House01;

Anslem.House01 = House01;