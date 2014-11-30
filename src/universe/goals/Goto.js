/**
 * Go to
 *
 * @module Anslem.Universe.Goals
 * @class Goto
 * @constructor
 * @param {Object} params {}
 */
function Goto(params) {
    this.description = "Go to target";
    this.label = "Go to";
    this.params = params || {};
    Goto.prototype.getAction = function (params) {
        if (Math.abs(params.x - this.x) < this.width) {
            this.goal = false;
            return new Actions.Idle();
        }
        return new Actions.Walk({dir: params.x > this.x ? 1 : -1});
    };
}
Goals.Goto = Goto;