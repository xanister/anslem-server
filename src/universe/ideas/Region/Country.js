/**
 * Country
 *
 * @module Anslem.Universe
 */

/**
 * Country
 *
 * @class Country
 * @constructor
 * @extends Idea
 * @param {String} slug
 */
function Country(slug) {
    Region.call(this, slug);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('country');
    this.categories.push('visible');

    /*
     * Country defaults
     */
    this.setSprite("sign01");
}
Country.prototype = new Region();
Country.prototype.constructor = Country;

Anslem.Country = Country;