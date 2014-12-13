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

        zin.entrance2 = new Door();
        zin.entrance2.warp(500, zin.height - zin.buffer.bottom - (zin.entrance2.height / 2), zin);

        var forest = new SkeletonForest();
        forest.populate();
        forest.warp(20, 10, this);

        var forest2 = new SkeletonForest();
        forest2.populate();
        forest2.warp(30, 10, this);

        zin.entrance.targetDoor = forest.entrance;
        forest.entrance.targetDoor = zin.entrance;
        forest2.entrance.targetDoor = zin.entrance2;
        zin.entrance2.targetDoor = forest2.entrance;
    };

    /*
     * Universe defaults
     */
}
Universe.prototype = new Region();
Universe.prototype.constructor = Universe;

Anslem.Universe = Universe;