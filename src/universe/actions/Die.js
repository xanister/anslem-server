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
    Die.prototype.run = function (params) {

    };
    Die.prototype.updateAnimation = function () {
        this.setAnimation("die");
    };
}
Actions.Die = Die;