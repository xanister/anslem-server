/**
 * Go to
 *
 * @module Anslem.Universe.Goals
 * @class Goto
 * @static
 */
Goals.Goto = {
    description: "Go to target",
    label: "Go to",
    getAction: function (params) {
        return new Actions.Walk({dir: params.x > this.x ? 1 : -1});
    }
};