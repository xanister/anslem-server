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
 * Dead
 *
 * @module Anslem.Universe.Goals
 * @class Dead
 * @static
 */
Goals.Dead = {
    description: "Dead",
    label: "Dead",
    getAction: function () {
        if (this.inputs && this.inputs.events.keydown.R) {
            this.stats.health = 100;
            this.baseGoal = Goals.PlayerInput;
            return new Actions.Idle();
        }
        if (Math.random() * 2000 < 5) {
            this.stats.health = 100;
            this.baseGoal = Goals.EatBrains;
            return new Actions.Idle();
        }

        return new Actions.Die();
    }
};
/**
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @class EatBrains
 * @static
 */
Goals.EatBrains = {
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        var nearest = this.instanceNearest("player");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (nearest.baseGoal !== Goals.Dead && dist < this.stats.perception)
                return Goals.Kill.getAction.call(this, nearest);
        }
        return new Actions.Idle();
    }
};
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
/**
 * Kill target
 *
 * @module Anslem.Universe.Goals
 * @class Kill
 * @static
 */
Goals.Kill = {
    description: "Kill target",
    label: "Kill",
    getAction: function (params) {
        var dist = this.distanceTo(params.x, params.y);
        if (dist < this.width)
            return new Actions.Attack({dir: params.x > this.x ? 1 : -1});
        return Goals.Goto.getAction.call(this, params);
    }
};
/**
 * PlayerInput
 *
 * @module Anslem.Universe.Goals
 * @class PlayerInput
 * @static
 */
Goals.PlayerInput = {
    description: "PlayerInput",
    label: "Player Goal",
    getAction: function () {
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
        }

        // Idle
        return new Actions.Idle();
    }
};
module.exports = Goals;