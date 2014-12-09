/**
 * Attack with whatever I am holding
 *
 * @module Anslem.Universe.Actions
 * @class Attack
 * @constructor
 * @param {Object} params {dir: 1 || -1, target: {Idea}}
 * @param {Number} speed
 */
function Attack(params, speed) {
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = speed || 36;
    Attack.prototype.run = function (params) {
        this.facing = params.dir;

        var hit = params.target ? (this.collides(params.target.bbox()) ? params.target : false) : this.instancePlace("physical", this.x + ((this.width / 2) * params.dir), this.y);
        if (hit && hit.immunityTimeout === 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: this.stats.strength});
            hit.immunityTimeout = this.action.speed;
        }
    };
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack");
        if (this.sprite.animation === "attack")
            this.sprite.frameSpeed = this.sprite.src["attack"].frameCount / this.action.speed;
    };
}
Actions.Attack = Attack;