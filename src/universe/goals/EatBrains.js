/**
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @class EatBrains
 * @static
 */
Goals.EatBrains = {
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        if (this.stats.health <= 0) {
            this.baseGoal = Goals.Dead;
            return new Actions.Die();
        }

        var nearest = this.instanceNearest("aware");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (nearest.baseGoal !== Goals.Dead && dist < this.stats.perception)
                return Goals.Kill.getAction.call(this, nearest);
        }
        return new Actions.Idle();
    }
};