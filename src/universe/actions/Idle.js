/**
 * Idle
 *
 * @module Anslem.Universe.Actions
 * @class Idle
 * @constructor
 */
function Idle() {
    this.id = actionIdCounter++;
    this.description = "Idle";
    this.label = "Idle";
    this.params = false;
    this.progress = 0;
    this.speed = 1;
    Idle.prototype.run = function () {

    };
    Idle.prototype.updateAnimation = function () {
        if (this.stats.health <= 0)
            this.setAnimation("die");
        else if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else if (this.xSpeed !== 0) {
            this.setAnimation("walk");
            if (this.sprite.animation === "walk")
                this.sprite.frameSpeed = this.sprite.src["walk"].frameSpeed * (Math.abs(this.xSpeed / this.stats.speed) * 0.75) + 0.25;
        } else if (this.stats.health < 50)
            this.setAnimation("tired");
        else
            this.setAnimation("default");
    };
}
Actions.Idle = Idle;