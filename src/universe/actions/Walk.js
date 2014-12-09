/**
 * Walk
 *
 * @module Anslem.Universe.Actions
 * @class Walk
 * @constructor
 * @param {Object} params direction to move, {dir: 1 || -1}
 */
function Walk(params) {
    this.description = "Walk";
    this.label = "Walk";
    this.params = params;
    this.progress = 0;
    this.speed = 1;
    Walk.prototype.run = function (params) {
        if (params.dir !== 0)
            this.facing = params.dir < 0 ? -1 : 1;
        if ((this.xSpeed < this.stats.speed && params.dir > 0) || (this.xSpeed > -this.stats.speed && params.dir < 0)) {
            var accel = params.dir * this.stats.accel;
            this.xSpeed += (params.dir * this.stats.accel);
        }
    };
    Walk.prototype.updateAnimation = function () {
        if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else {
            this.setAnimation("walk");
            if (this.animation === "walk")
                this.sprite.frameSpeed = this.sprite.src["walk"].frameSpeed * Math.abs((this.xSpeed) / this.stats.speed);
        }
    };
}
Actions.Walk = Walk;