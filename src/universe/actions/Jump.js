/**
 * Jump
 *
 * @module Anslem.Universe.Actions
 * @class Jump
 * @constructor
 */
function Jump() {
    this.description = "Jump";
    this.label = "Jump";
    this.params = false;
    this.progress = 0;
    this.speed = 5;
    Jump.prototype.run = function () {
        if (this.action.progress === 0 && this.ySpeed === 0)
            this.ySpeed -= this.stats.jump;
    };
    Jump.prototype.updateAnimation = function () {
        this.setAnimation("jump");
    };
}
Actions.Jump = Jump;