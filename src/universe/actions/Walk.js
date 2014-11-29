/**
 * Walk
 *
 * @class Walk
 * @constructor
 * @for Actions
 * @param {Object} params direction to move
 */
Actions.Walk = function Walk(params) {
    Walk.description = "Walk";
    Walk.label = "Walk";
    this.params = params;
    Walk.prototype.run = function (params) {
        this.setSprite("sprGoblinWalk");

        this.sprite.mirror = params.dir < 0 ? true : (params.dir > 0 ? false : this.sprite.mirror);
        this.sprite.frameSpeed = this.sprite.src.frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed);
        if ((this.xSpeed < this.stats.speed && params.dir === 1) || (this.xSpeed > -this.stats.speed && params.dir === -1))
            this.xSpeed += (params.dir * this.stats.accel);
    };
};