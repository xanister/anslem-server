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
    this.height = 1048 * UniverseConfig.scaleFactor;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 30000 * UniverseConfig.scaleFactor;

    /**
     * Randomly populate the region
     *
     * @method populate
     */
    Region.prototype.populate = function () {
        this.ground = new Idea(['landscape']);
        this.ground.setSprite("blockStoneTall", true, false, 1);
        this.ground.warp(0, this.height - (this.ground.height / 2), this);
        this.ground.z = 5;
        this.buffer.bottom = this.ground.height - 96;

        this.entrance = new Door();
        this.entrance.warp(200, this.height - this.buffer.bottom - (this.entrance.height / 2), this);
    };
}
Region.prototype = new Idea();
Region.prototype.constructor = Region;

Anslem.Region = Region;