/**
 * FartAround
 *
 * @module Anslem.Universe.Goals
 * @class FartAround
 * @static
 */
Goals.FartAround = {
    id: goalIdCounter++,
    description: "FartAround",
    label: "FartAround",
    getAction: function () {

        return new Actions.Idle();
    }
};