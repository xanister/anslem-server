/**
 * Attack with whatever I am holding
 *
 * @module Anslem.Universe.Actions
 * @class Attack
 * @constructor
 * @param {Object} params {dir: 1 || -1, target: {Idea}}
 * @param {Number} speed modifier
 */
function Attack(params, speed) {
    this.id = actionIdCounter++;
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = 30 * (speed || 1);
    Attack.prototype.run = function (params) {
        // Face the direction I'm attacking
        if (this.action.progress === 0)
            this.facing = params.dir;

        // Did I hit something(what was I aiming at)
        var hit = false;
        if (params.target) {
            if (this.facing === 1) {
                hit = params.target.collidesRect(
                        this.x, this.y - (this.height / 2),
                        this.x + this.sprite.src[this.sprite.animation].width, this.y + (this.height / 2)
                        ) ? params.target : false;
            } else {
                hit = params.target.collidesRect(
                        this.x - this.sprite.src[this.sprite.animation].width, this.y - (this.height / 2),
                        this.x, this.y + (this.height / 2)
                        ) ? params.target : false;
            }
        } else {
            if (this.facing === 1) {
                hit = this.instanceRect("physical", {
                    left: this.x + (this.width / 2),
                    top: this.y - (this.height / 2),
                    right: this.x + (this.sprite.src[this.sprite.animation].width / 2),
                    bottom: this.y + (this.height / 2)
                });
            } else {
                hit = this.instanceRect("physical", {
                    left: this.x - (this.sprite.src[this.sprite.animation].width / 2),
                    top: this.y - (this.height / 2),
                    right: this.x - (this.width / 2),
                    bottom: this.y + (this.height / 2)
                });
            }
        }

        // If the hit is valid...HITEM
        if (hit && hit.immunityTimeout <= 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: this.stats.strength});
            hit.immunityTimeout = this.action.speed;
        }
    }
    ;
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack");
        if (this.sprite.animation === "attack")
            this.sprite.frameSpeed = this.sprite.frameCount / this.action.speed;
    };
}
Actions.Attack = Attack;