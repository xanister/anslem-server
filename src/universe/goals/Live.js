/**
 * Live
 *
 * @module Anslem.Universe.Goals
 * @class Live
 * @static
 */
Goals.Live = {
    id: goalIdCounter++,
    description: "Live",
    label: "Live",
    getAction: function () {

        return new Actions.Idle();
    }
};