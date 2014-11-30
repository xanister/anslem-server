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
        var nearest = this.instanceNearest("player");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (nearest.baseGoal !== Goals.Dead && dist < this.stats.perception)
                return Goals.Kill.getAction.call(this, nearest);
        }
        return new Actions.Idle();
    }
};