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