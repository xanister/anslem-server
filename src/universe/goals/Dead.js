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
        if (this.inputs && this.inputs.events.keydown.R) {
            this.stats.health = 100;
            this.baseGoal = Goals.PlayerInput;
            return new Actions.Idle();
        }

        return new Actions.Die();
    }
};