/**
 * Compile all actions and goals and return Goals module
 *
 * @module Anslem.Universe.Goals
 * @requires AnslemServerConfig, compileActions
 */
var AnslemServerConfig = require("./../AnslemServerConfig");
var Actions = require('./compileActions');

/**
 * Goals
 *
 * @class Goals
 * @static
 */
var Goals = {};
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
/**
 * PlayerInput
 *
 * @module Anslem.Universe.Goals
 * @class PlayerInput
 * @constructor
 * @param {Object} params {}
 */
function PlayerInput(params) {
    this.description = "PlayerInput";
    this.label = "Player Goal";
    this.params = params || {};
    PlayerInput.prototype.getAction = function (params) {
        // Desktop Controls
        if (this.inputs.events.keydown.F) {
            return new Actions.Attack({dir: this.facing});
        } else if (this.inputs.events.keydown.W) {
            return new Actions.Jump();
        } else if (this.inputs.keyboard.A) {
            return new Actions.Walk({dir: -1});
        } else if (this.inputs.keyboard.D) {
            return new Actions.Walk({dir: 1});
        }

        // Mobile controls
        if (this.inputs.events.swiperight) {
            return new Actions.Attack({dir: 1});
        } else if (this.inputs.events.swipeleft) {
            return new Actions.Attack({dir: -1});
        } else if (this.inputs.events.swipeup) {
            return new Actions.Jump();
        } else if (this.inputs.touches[0]) {
            if ((this.inputs.touches[0].x * this.view.scale) + this.view.x > this.x) {
                return new Actions.Walk({dir: 1});
            } else if ((this.inputs.touches[0].x * this.view.scale) + this.view.x < this.x) {
                return new Actions.Walk({dir: -1});
            }
        } else if (this.inputs.events.tap2) {
            console.log("Double tap");
        }

        // Idle
        return new Actions.Idle();
    };
}
Goals.PlayerInput = PlayerInput;
module.exports = Goals;