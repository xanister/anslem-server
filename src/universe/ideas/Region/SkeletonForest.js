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

        this.ground.setSprite("blockGrass", true, false, 1);
        this.ground.warp(0, this.height - (this.ground.sprite.src.default.height / 2), this);
        this.buffer.bottom = this.ground.sprite.src.default.height - this.ground.sprite.src.default.topOffset;

//        var mountains = new Idea("[landscape]");
//        mountains.setSprite("bgMountainsSnow", true, false, 0.1);
//        mountains.warp(0, 0, this);

        var block = new Platform();
        block.warp(600, this.height - 800, this);

        this.entrance.warp(200, this.height - this.buffer.bottom - (this.entrance.height / 2), this);

        for (var n = 0; n < 15; n++) {
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