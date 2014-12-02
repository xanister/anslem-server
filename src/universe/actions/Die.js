/**
 * Die
 *
 * @module Anslem.Universe.Actions
 * @class Die
 * @constructor
 */
function Die() {
    this.description = "Die";
    this.label = "Die";
    this.params = false;
    this.progress = 0;
    this.speed = 20;
    Die.prototype.run = function () {
        if (this.action.progress === 0) {
            this.alive = false;
            this.removeCategory('aware');
            this.removeCategory('physical');
        }
    };
    Die.prototype.updateAnimation = function () {
        this.setAnimation("die");
    };
}
Actions.Die = Die;