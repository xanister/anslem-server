/**
 * Available actions
 *
 * @module Anslem.Universe.scripts
 */

/**
 * Actions
 *
 * @class Actions
 * @static
 */
var Actions = {};
/**
 * Idle
 *
 * @class Idle
 * @constructor
 * @for Actions
 */
Actions.Idle = function Idle() {
    Idle.description = "Idle";
    Idle.label = "Idle";
    this.params = false;
    Idle.prototype.run = function () {
        this.setAnimation("default");
    };
};
/**
 * Jump
 *
 * @class Jump
 * @constructor
 * @for Actions
 */
Actions.Jump = function Jump() {
    Jump.description = "Jump";
    Jump.label = "Jump";
    this.params = false;
    Jump.prototype.run = function () {
        this.setAnimation("jump");
        if (this.ySpeed === 0)
            this.ySpeed -= this.stats.jump;
    };
};
/**
 * Walk
 *
 * @class Walk
 * @constructor
 * @for Actions
 * @param {Object} params direction to move
 */
Actions.Walk = function Walk(params) {
    Walk.description = "Walk";
    Walk.label = "Walk";
    this.params = params;
    Walk.prototype.run = function (params) {
        if (this.ySpeed !== 0) {
            this.setAnimation("jump");
        } else {
            this.setAnimation("walk");
            this.sprite.mirror = params.dir < 0 ? true : (params.dir > 0 ? false : this.sprite.mirror);
            this.sprite.frameSpeed = this.sprite.src["walk"].frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed);
        }

        if ((this.xSpeed < this.stats.speed && params.dir === 1) || (this.xSpeed > -this.stats.speed && params.dir === -1))
            this.xSpeed += (params.dir * this.stats.accel);
    };
};
module.exports = Actions;