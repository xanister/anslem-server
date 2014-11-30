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
        return new Actions.Idle();
    };
}
Goals.EatBrains = EatBrains;