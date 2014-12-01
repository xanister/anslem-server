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
        if (this.inputs && (this.inputs.events.keydown.R || this.inputs.events.swipeup)) {
            this.stats.health = 100;
            this.stats.jump = 0;
            this.stats.speed = 10;
            this.baseGoal = Goals.PlayerInput;
            this.addCategory('physical');
            this.setSprite("skeleton");
        }
        if (!this.inputs && Math.random() * 3000 < 5) {
            this.stats.health = 100;
            this.baseGoal = Goals.EatBrains;
            this.addCategory('physical');
        }
        return new Actions.Idle();
    }
};