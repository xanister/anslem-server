/**
 * Go to
 *
 * @module Anslem.Universe.Goals
 * @class Goto
 * @static
 */
Goals.Goto = {
    id: goalIdCounter++,
    description: "Go to target",
    label: "Go to",
    getAction: function () {
        if (this.distanceTo(this.focus.x, this.focus.y) < this.width)
            return new Actions.Think({goal: this.baseGoal, focus: false});
        return new Actions.Walk({dir: this.focus.x > this.x ? 1 : -1});
    }
};