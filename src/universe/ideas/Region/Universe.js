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
 */
function Universe() {
    Region.call(this);
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
    this.categories.push('universe');

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 2048 * UniverseConfig.scaleFactor;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 30000 * UniverseConfig.scaleFactor;

    /**
     * Populate the universe
     *
     * @method populate
     */
    Universe.prototype.populate = function () {
        var zin = new Region();
        zin.populate();
        zin.warp(10, 10, this);

        var forest = new SkeletonForest();
        forest.populate();
        forest.warp(20, 10, this);

        zin.entrance.targetDoor = forest.entrance;
        forest.entrance.targetDoor = zin.entrance;
    };

    /*
     * Universe defaults
     */
}
Universe.prototype = new Region();
Universe.prototype.constructor = Universe;

Anslem.Universe = Universe;