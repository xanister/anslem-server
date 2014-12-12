/**
 * Platform
 *
 * @module Anslem.Universe
 */

/**
 * Platform
 *
 * @class Platform
 * @constructor
 * @extends Idea
 */
function Platform() {
    Idea.call(this);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('solid');
    this.categories.push('platform');

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 100;

    /*
     * Platform defaults
     */
    this.setSprite("blockStoneTall");
}
Platform.prototype = new Idea();
Platform.prototype.constructor = Platform;

Anslem.Platform = Platform;