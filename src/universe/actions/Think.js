/**
 * Think
 *
 * @module Anslem.Universe.Actions
 * @class Think
 * @constructor
 * @param {Goal} params
 */
function Think(params) {
    this.id = actionIdCounter++;
    this.description = "Think";
    this.label = "Think";
    this.params = params;
    this.progress = 0;
    this.speed = 1;
    Think.prototype.run = function (params) {
        this.goal = params.goal;
        this.focus = params.focus;
    };
    Think.prototype.updateAnimation = function () {
        if (this.stats.health <= 0)
            this.setAnimation("die");
        else if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else if (this.xSpeed !== 0) {
            this.setAnimation("walk");
            if (this.sprite.animation === "walk")
                this.sprite.frameSpeed = this.sprite.src["walk"].frameSpeed * Math.min(Math.abs(this.xSpeed / this.stats.speed), 1);
        } else if (this.stats.health < 50)
            this.setAnimation("tired");
        else
            this.setAnimation("default");
    };
}
Actions.Think = Think;