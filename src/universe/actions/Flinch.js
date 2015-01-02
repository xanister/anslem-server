/**
 * Take a hit
 *
 * @module Anslem.Universe.Actions
 * @class Flinch
 * @constructor
 * @param {Object} params {dir: 1 || -1, strength: 5}
 */
function Flinch(params) {
    this.id = actionIdCounter++;
    this.description = "Take a hit";
    this.label = "Flinch";
    this.params = params;
    this.progress = 0;
    this.speed = 8;
    Flinch.prototype.run = function (params) {
        if (this.action.progress === 0) {
            this.interrupt = true;

            // Knockback
            this.xSpeed += ((this.height / 10) * params.dir);
            this.ySpeed -= ((this.height / 10) * 0.5);

            // Damage
            this.stats.health -= params.strength;
        }
    };
    Flinch.prototype.updateAnimation = function () {
        this.setAnimation("flinch");
    };
}
Actions.Flinch = Flinch;