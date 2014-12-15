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
        return new Actions.Walk({dir: this.focus.x > this.x ? 1 : -1});
    }
};