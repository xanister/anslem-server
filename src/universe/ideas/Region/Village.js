/**
 * Village
 *
 * @module Anslem.Universe
 */

/**
 * Village
 *
 * @class Village
 * @constructor
 * @extends Idea
 * @param {String} slug
 */
function Village(slug) {
    Region.call(this, slug);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('universe');
    this.categories.push('visible');

    /**
     * Randomly populate the region
     *
     * @method populate
     */
    Village.prototype.populate = function () {
        Region.prototype.populate.call(this);

        // Ground
        this.ground = new Ground();
        this.ground.warp(0, this.innerHeight - (this.ground.sprite.src.default.height / 2), this);
        this.buffer.bottom = this.ground.sprite.src.default.height - this.ground.sprite.src.default.topOffset;

        // Midground
        /*
        var midground = new Landscape();
        midground.setSprite("grass02", true, false, 1);
        midground.z = 100;
        midground.warp(0, this.innerHeight - this.buffer.bottom - (midground.height / 2), this);
        */
        
        // Landscape
        var mountains = new Landscape();
        mountains.warp(0, midground.y - (midground.height / 2) - (mountains.height * 0.25), this);

        // Move inner regions to match new buffer
        for (var index in this.contents.region) {
            var r = this.contents.region[index];
            r.warp(r.x, this.innerHeight - this.buffer.bottom - (r.height / 2));
        }
    };

    /*
     * Zin defaults
     */
    this.setSprite("sign01");
}
Village.prototype = new Region();
Village.prototype.constructor = Village;

Anslem.Village = Village;