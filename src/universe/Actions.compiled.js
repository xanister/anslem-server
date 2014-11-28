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
 * @method Idle
 * @for Actions
 */
Actions.Idle = function Idle() {
    Idle.description = "Idle";
    Idle.label = "Idle";
    this.params = false;
    Idle.prototype.run = function () {
        if (this.sprite.image !== "sprGoblin")
            this.setSprite("sprGoblin");
    };
};
/**
 * Jump
 *
 * @method Jump
 * @for Actions
 */
Actions.Jump = function Jump() {
    Jump.description = "Jump";
    Jump.label = "Jump";
    this.params = false;
    Jump.prototype.run = function () {
        this.ySpeed -= this.stats.jump;
    };
};
/**
 * Move
 *
 * @method Move
 * @for Actions
 * @param {Object} params direction to move
 */
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        if (this.sprite.image !== "sprGoblinWalking")
            this.setSprite("sprGoblinWalking");
        if (params.dir === 0) {

        } else {
            this.sprite.mirror = params.dir > 0 ? false : true;
            this.sprite.frameSpeed = this.sprite.src.frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed);
            if ((this.xSpeed < this.stats.speed && params.dir === 1) || (this.xSpeed > -this.stats.speed && params.dir === -1))
                this.xSpeed += (params.dir * this.stats.accel);
        }
    };
};
module.exports = Actions;