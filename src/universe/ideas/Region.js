/**
 * Region
 *
 * @module Anslem.Universe
 */

/**
 * Region
 *
 * @class Region
 * @constructor
 * @extends Idea
 */
function Region() {
    Idea.call(this);
    /**
     * Obstruction buffer, for grounds and ceilings
     *
     * @property buffer
     * @type {Object}
     */
    this.buffer = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('region');

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 4096 * UniverseConfig.scaleFactor;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 20000 * UniverseConfig.scaleFactor;

    /**
     * Return savable object
     *
     * @method load
     * @param {Object} src
     */
    Region.prototype.load = function (src) {
        Idea.prototype.load.call(this, src);
        this.buffer = src.buffer;
        return this;
    };

    /**
     * Randomly populate the region
     *
     * @method populate
     */
    Region.prototype.populate = function () {
        this.ground = new Landscape();
        this.ground.warp(0, this.height - (this.ground.sprite.src.default.height / 2), this);
        this.buffer.bottom = this.ground.sprite.src.default.height - this.ground.sprite.src.default.topOffset;

        this.entrance = new Door();
        this.entrance.warp(200, this.height - this.buffer.bottom - (this.entrance.height / 2), this);
    };

    /**
     * Return savable object
     *
     * @method toSimple
     * @returns {Object}
     */
    Region.prototype.toSimple = function () {
        var simple = Idea.prototype.toSimple.call(this);
        simple.buffer = this.buffer;
        return simple;
    };
}
Region.prototype = new Idea();
Region.prototype.constructor = Region;

Anslem.Region = Region;