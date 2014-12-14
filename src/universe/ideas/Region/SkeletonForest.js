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
        mountains.z = 1;
        mountains.setSprite("mountains01", true, false, 0.1);
        mountains.warp(0, this.height - this.buffer.bottom - (mountains.height / 2), this);

        var block = new Platform();
        block.warp(600, this.height - 800, this);

        for (var n = 0; n < 25; n++) {
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