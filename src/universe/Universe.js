/**
 * Universe
 *
 * @module Anslem.Universe
 * @requires Idea, Sprites
 */
var Idea = require("./Idea");
var Sprites = require("./Sprites");

/**
 * Universe
 *
 * @class Universe
 * @constructor
 * @extends Idea
 */
function Universe() {
    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories = ['universe'];

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 2048;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 40000;

    /**
     * Populate the universe
     *
     * @method populate
     */
    Universe.prototype.populate = function () {
        var i = new Idea();
        i.setSprite("bgClouds", true, false, 0.2);
        i.warp(0, this.height - Sprites[i.sprite.image].height, this);

        var i = new Idea();
        i.setSprite("bgMountains", true, false, 0.4);
        i.warp(0, this.height - Sprites[i.sprite.image].height, this);

        var i = new Idea();
        i.setSprite("bgMountainsMidground", true, false, 0.6);
        i.warp(0, this.height - Sprites[i.sprite.image].height, this);

        var i = new Idea();
        i.setSprite("bgTrees", true, false, 0.8);
        i.warp(0, this.height - Sprites[i.sprite.image].height, this);

        var i = new Idea();
        i.setSprite("bgGround", true, false, 1);
        i.warp(0, this.height + (Sprites[i.sprite.image].height / 2), this);
    };
}
Universe.prototype = new Idea();
Universe.prototype.constructor = Universe;

module.exports = Universe;