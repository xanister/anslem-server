/**
 * Building
 *
 * @module Anslem.Universe
 */

/**
 * Building
 *
 * @class Building
 * @constructor
 * @extends Idea
 * @param {String} slug
 */
function Building(slug) {
    Region.call(this, slug);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('building');
    this.categories.push('visible');

    /**
     * Randomly populate the region
     *
     * @method populate
     * @param {String} slug
     */
    Building.prototype.populate = function (slug) {
        Region.prototype.populate.call(this, slug);

        // Ground
        this.ground = new Floor();
        this.ground.warp(0, this.innerHeight - (this.ground.sprite.src.default.height / 2), this);
        this.buffer.bottom = this.ground.sprite.src.default.height - this.ground.sprite.src.default.topOffset;

        // Midground
        /*
        var midground = new Landscape();
        midground.setSprite("floor02", true, false, 1);
        midground.z = 100;
        midground.warp(0, this.ground.y - (this.ground.height / 2) - (midground.height / 2) + 32, this);
        */
        
        // Objects
        for (var x = 2048; x < this.innerWidth && x < 8196; x += 512) {
            var platform = new Platform();
            platform.warp(
                    x,
                    this.innerHeight - this.buffer.bottom - midground.height + Math.floor(Math.random() * midground.height * 0.5),
                    this
                    );
        }
    };

    /*
     * Building defaults
     */
    this.setSprite("door01");
}
Building.prototype = new Region();
Building.prototype.constructor = Building;

Anslem.Building = Building;