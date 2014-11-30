/**
 * Attack with whatever I am holding
 *
 * @module Anslem.universe.scripts.Actions
 * @class Attack
 * @constructor
 * @for Actions
 * @param {Object} params {dir: 1 || -1, strength: 10}
 */
Actions.Attack = function Attack(params) {
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Attack.prototype.run = function (params) {
        this.facing = params.dir;

        var hit = this.instancePlace("physical", this.x + (50 * params.dir), this.y);
        if (hit && hit.immunityTimeout === 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: 10});
            hit.immunityTimeout = this.action.speed;
        }
    };
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack");
    };
};