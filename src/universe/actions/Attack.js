/**
 * Attack with whatever I am holding
 *
 * @module Anslem.Universe.Actions
 * @class Attack
 * @constructor
 * @param {Object} params {dir: 1 || -1}
 */
function Attack(params) {
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Attack.prototype.run = function (params) {
        this.facing = params.dir;

        var hit = this.instancePlace("physical", this.x + ((this.width / 2) * params.dir), this.y);
        if (hit && hit.immunityTimeout === 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: this.stats.strength});
            hit.immunityTimeout = this.action.speed;
        }
    };
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack", this.sprite.src["attack"].frameCount / this.action.speed);
    };
}
Actions.Attack = Attack;