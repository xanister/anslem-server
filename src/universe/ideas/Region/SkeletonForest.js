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

        // Midground
        var midground = new Landscape();
        midground.setSprite("grass02", true, false, 1);
        midground.z = 100;
        midground.warp(0, this.ground.y - (this.ground.height / 2) - (midground.height / 2) + 32, this);

        // Landscape
        var mountains = new Landscape();
        mountains.sprite.scrollSpeed = 0.3;
        mountains.warp(0, midground.y - (midground.height / 2) - (mountains.height * 0.25), this);

        var mountains2 = new Landscape();
        mountains2.z = mountains.z + 1;
        mountains2.sprite.scrollSpeed = 0.4;
        mountains2.warp(200, mountains.y + 64, this);

        // Trees
        for (var n = 0; n < 20; n++) {
            var t = new Tree01();
            do {
                t.warp(
                        Math.floor(Math.random() * this.innerWidth),
                        midground.y + Math.floor(Math.random() * midground.height) - (midground.height / 2) - (t.height * 0.4),
                        this
                        );
            } while (t.instancePlace("tree"));
        }

        // Monsters
        for (var n = 0; n < 5; n++) {
            var s = new Skeleton();
            s.warp(500 + (Math.random() * (this.innerWidth - 1000)), this.innerHeight - this.buffer.bottom - (s.height / 2), this);
        }

        // Move inner regions to match new buffer
        for (var index in this.contents.region) {
            var r = this.contents.region[index];
            r.warp(r.x, this.innerHeight - this.buffer.bottom - (r.height / 2));
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