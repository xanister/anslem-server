/**
 * EatBrains.js
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @property EatBrains
 * @for Goals
 * @type {Object}
 */
Goals.EatBrains = {
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        return new Actions.Idle();
    }
};