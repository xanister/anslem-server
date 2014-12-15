/**
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @class EatBrains
 * @static
 */
Goals.EatBrains = {
    id: goalIdCounter++,
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        var nearest = this.instanceNearest("hasbrains");
        if (nearest)
            return new Actions.Think({goal: Goals.Kill, focus: nearest});

        if (!this.focus || (this.distanceTo(this.focus.x, this.y) < this.width)) {
            this.focus = {x: Math.random() * this.container.width, y: this.y};
        }

        return Goals.Goto.getAction.call(this);
    }
};