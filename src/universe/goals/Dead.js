/**
 * Dead
 *
 * @module Anslem.Universe.Goals
 * @class Dead
 * @static
 */
Goals.Dead = {
    description: "Dead",
    label: "Dead",
    getAction: function () {
        if (this.alive) {
            this.stats.timeOfDeath = (new Date()).getTime();
            return new Actions.Die();
        }
        if (this.inputs && (this.inputs.events.keydown.R || this.inputs.events.swipeup)) {
            this.stats.health = 100;
            this.stats.jump = 0;
            this.stats.speed = 10;
            this.baseGoal = Goals.PlayerInput;
            this.addCategory('physical');
            this.setSprite("skeleton");
            this.alive = true;
        }
        if (!this.inputs && ((new Date()).getTime() > (this.stats.timeOfDeath + 60000))) {
            this.stats.health = 100;
            this.baseGoal = Goals.EatBrains;
            this.addCategory('physical');
            this.alive = true;
        }
        return new Actions.Idle();
    }
};