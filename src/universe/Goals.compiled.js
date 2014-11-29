/**
 * Compile all actions and goals and return Goals module
 *
 * @module Anslem.Universe.scripts
 * @requires compileActions
 */
var Actions = require('./compileActions');

/**
 * Goals
 *
 * @class Goals
 * @static
 */
var Goals = {};
/**
 * EatBrains.js
 * Eat Brains
 *
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
/**
 * PlayerInput
 *
 * @property PlayerInput
 * @for Goals
 * @type {Object}
 */
Goals.PlayerInput = {
    description: "PlayerInput",
    label: "Player Goal",
    getAction: function () {
        // Desktop Controls
        if (this.inputs.events.keydown.W) {
            return new Actions.Jump();
        } else if (this.inputs.keyboard.A) {
            return new Actions.Walk({dir: -1});
        } else if (this.inputs.keyboard.D) {
            return new Actions.Walk({dir: 1});
        }

        // Mobile controls
        if (this.inputs.events.swipe.up) {
            return new Actions.Jump();
        } else if (this.inputs.touches[0]) {
            if ((this.inputs.touches[0].x * this.view.scale) + this.view.x > this.x) {
                return new Actions.Walk({dir: 1});
            } else if ((this.inputs.touches[0].x * this.view.scale) + this.view.x < this.x) {
                return new Actions.Walk({dir: -1});
            }
        }

        // Idle
        if (this.ySpeed !== 0)
            return new Actions.Jump();
        else if (this.xSpeed !== 0)
            return new Actions.Walk({dir: 0});
        else
            return new Actions.Idle();
    }
};
module.exports = Goals;