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
        this.ySpeed -= 20;
    };
};