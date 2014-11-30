/**
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @class EatBrains
 * @constructor
 * @param {Object} params {}
 */
function EatBrains(params) {
    this.description = "Eat brains";
    this.label = "Eat brains";
    this.params = params || {};
    EatBrains.prototype.getAction = function () {
        var nearest = this.instanceNearest("player");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (dist < this.width)
                return new Actions.Attack({dir: nearest.x > this.x ? 1 : -1});
            else if (dist < this.stats.perception)
                this.goal = new Goals.Goto(nearest);
            else
                this.goal = new Goals.Goto({x: this.x + (Math.random() * 1000) - 500, y: this.y});
        }
        return new Actions.Idle();
    };
}
Goals.EatBrains = EatBrains;