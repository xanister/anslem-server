/**
 * SkeletonForest
 *
 * @module Anslem.Universe
 */

/**
 * SkeletonForest
 *
 * @class SkeletonForest
 * @constructor
 * @extends Idea
 * @param {String} slug
 */
function SkeletonForest(slug) {
    Region.call(this, slug);

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('forest');
    this.categories.push('visible');

    /**
     * Randomly populate the region
     *
     * @method populate
     * @param {String} slug
     */
    SkeletonForest.prototype.populate = function (slug) {
        Region.prototype.populate.call(this, slug);

        // Ground
        this.ground = new Ground();
        this.ground.warp(0, this.innerHeight - (this.ground.sprite.src.default.height / 2), this);
        this.buffer.bottom = this.ground.sprite.src.default.height - this.ground.sprite.src.default.topOffset;

        // Landscape
        var mountains = new Landscape();
        mountains.warp(0, this.innerHeight - this.buffer.bottom - (mountains.height / 2), this);

        var mountains2 = new Landscape();
        mountains2.z = 2;
        mountains2.sprite.scrollSpeed = 0.2;
        mountains2.warp(200, this.innerHeight - this.buffer.bottom - (mountains.height * 0.4), this);

        // Monsters
        for (var n = 0; n < 5; n++) {
            var s = new Skeleton();
            s.warp(500 + (Math.random() * (this.innerWidth - 1000)), this.innerHeight - this.buffer.bottom - (s.height / 2), this);
        }
    };

    /*
     * SkeletonForest defaults
     */
    this.setSprite("door01");
}
SkeletonForest.prototype = new Region();
SkeletonForest.prototype.constructor = SkeletonForest;

Anslem.SkeletonForest = SkeletonForest;