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
        var nearest = this.instanceNearest("aware");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (nearest.baseGoal !== Goals.Dead && dist < this.stats.perception)
                return Goals.Kill.getAction.call(this, nearest);
        }
        if (!this.stats.focus || (this.distanceTo(this.stats.focus.x, this.y) < this.width)) {
            this.stats.focus = {x: Math.random() * this.container.width, y: this.y};
        }

        return Goals.Goto.getAction.call(this, this.stats.focus);
    }
};