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
        this.sprite.mirror = params.dir > 0 ? false : true;
        if ((this.xSpeed < this.stats.speed && params.dir === 1) || (this.xSpeed > -this.stats.speed && params.dir === -1))
            this.xSpeed += (params.dir * this.stats.accel);
    };
};
module.exports = Actions;