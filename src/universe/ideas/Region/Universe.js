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

    /**
     * Randomly populate the region
     *
     * @method populate
     */
    Universe.prototype.populate = function () {
        Region.prototype.populate.call(this);

        var goblin = new Goblin();
        goblin.warp(500, 500, this);

        // Move inner regions to match new buffer
        for (var index in this.contents.region) {
            var r = this.contents.region[index];
            r.warp(r.x, this.innerHeight - this.buffer.bottom - (r.height / 2));
        }
    };

    /*
     * Universe defaults
     */
}
Universe.prototype = new Region();
Universe.prototype.constructor = Universe;

Anslem.Universe = Universe;