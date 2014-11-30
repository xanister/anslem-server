/**
 * Take a hit
 *
 * @module Anslem.Universe.Actions
 * @class Flinch
 * @constructor
 * @for Actions
 * @param {Object} params {dir: 1 || -1, strength: 5}
 */
Actions.Flinch = function Flinch(params) {
    this.description = "Take a hit";
    this.label = "Flinch";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Flinch.prototype.run = function (params) {
        if (this.action.progress === 0) {
            this.xSpeed += (params.strength * params.dir);
            this.ySpeed -= (params.strength * 0.5);
        }
    };
    Flinch.prototype.updateAnimation = function () {
        this.setAnimation("flinch");
    };
};