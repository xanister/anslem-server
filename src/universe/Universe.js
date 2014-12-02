/**
 * Universe
 *
 * @module Anslem.Universe
 * @requires Entity, Idea, Sprites
 */
var Entity = require("./Entity");
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
    this.width = 20000;

    /**
     * Populate the universe
     *
     * @method populate
     */
    Universe.prototype.populate = function () {
        var i = new Idea(['landscape']);
        i.setSprite("bgClouds", true, false, 0.2);
        i.z = 0;
        i.warp(0, this.height - (Sprites[i.sprite.name]["default"].height / 2), this);

        var i = new Idea(['landscape']);
        i.setSprite("bgMountains", true, false, 0.4);
        i.z = 1;
        i.warp(0, this.height - (Sprites[i.sprite.name]["default"].height / 2), this);

        var i = new Idea(['landscape']);
        i.setSprite("bgMountainsMidground", true, false, 0.6);
        i.z = 2;
        i.warp(0, this.height - (Sprites[i.sprite.name]["default"].height / 2), this);

        var i = new Idea(['landscape']);
        i.setSprite("bgTrees", true, false, 0.8);
        i.z = 3;
        i.warp(0, this.height - (Sprites[i.sprite.name]["default"].height / 2), this);

        var i = new Idea(['landscape']);
        i.setSprite("bgGround", true, false, 1);
        i.z = 4;
        i.warp(0, this.height + (Sprites[i.sprite.name]["default"].height / 2) - 20, this);

        for (var n = 0; n < 5; n++) {
            var i = new Entity();
            i.setSprite("skeleton");
            i.removeCategory('aware');
            i.stats.speed = 5;
            i.warp(1000 + (Math.random() * (this.width - 1000)), 400, this);
        }
    };
}
Universe.prototype = new Idea();
Universe.prototype.constructor = Universe;

module.exports = Universe;