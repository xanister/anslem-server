/**
 * Universe
 *
 * @module Anslem.Universe
 */

/**
 * Universe
 *
 * @class Universe
 * @constructor
 * @extends Idea
 * @param {String} slug
 */
function Universe(slug) {
    Region.call(this, slug);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('universe');

    /*
     * Universe defaults
     */
}
Universe.prototype = new Region();
Universe.prototype.constructor = Universe;

Anslem.Universe = Universe;