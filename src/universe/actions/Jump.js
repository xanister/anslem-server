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
        this.ySpeed -= this.stats.jump;
    };
};