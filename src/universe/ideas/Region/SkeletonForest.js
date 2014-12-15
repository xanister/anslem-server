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
 */
function SkeletonForest() {
    Region.call(this);
    /**
     * Populate
     *
     * @method populate
     */
    SkeletonForest.prototype.populate = function () {
        Region.prototype.populate.call(this);

        var mountains = new Landscape();
        mountains.warp(0, this.height - this.buffer.bottom - (mountains.height / 2), this);

        var mountains2 = new Landscape();
        mountains2.z = 2;
        mountains2.sprite.scrollSpeed = 0.5;
        mountains2.warp(200, this.height - this.buffer.bottom - (mountains.height * 0.4), this);

        var block = new Platform();
        block.warp(600, this.height - 800, this);

        for (var n = 0; n < 50; n++) {
            var s = new Skeleton();
            s.warp(1000 + (Math.random() * (this.width - 1000)), 400, this);
        }
    };

    /*
     * SkeletonForest defaults
     */
}
SkeletonForest.prototype = new Region();
SkeletonForest.prototype.constructor = SkeletonForest;

Anslem.SkeletonForest = SkeletonForest;