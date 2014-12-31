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
        if (nearest) {
            return new Actions.Think({goal: Goals.Kill, focus: nearest});
        }
        return new Actions.Think({goal: Goals.Goto, focus: {x: Math.random() * this.container.innerWidth, y: this.y}});
    }
};