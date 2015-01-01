/**
 * RespondToKeyboardMouse
 *
 * @module Anslem.Universe.Goals
 * @class RespondToKeyboardMouse
 * @static
 */
Goals.RespondToKeyboardMouse = {
    id: goalIdCounter++,
    description: "RespondToKeyboardMouse",
    label: "Player Goal",
    getAction: function () {
        if (this.client.inputs.events.keydown) {
            if (this.client.inputs.events.keydown.F) {
                return new Actions.Attack({dir: this.facing}, 0.5);
            } else if (this.client.inputs.events.keydown.S && this.overActivatable) {
                return new Actions.Activate({target: this.overActivatable});
            } else if (this.client.inputs.events.keydown.V) {
                this.stats.godmode = true;
            }
        } else if (this.client.inputs.keyboard.W) {
            if (this.client.inputs.keyboard.A) {
                return new Actions.Jump({dir: -1});
            } else if (this.client.inputs.keyboard.D) {
                return new Actions.Jump({dir: 1});
            } else {
                return new Actions.Jump({dir: 0});
            }
        } else if (this.client.inputs.keyboard.A) {
            return new Actions.Walk({dir: -1});
        } else if (this.client.inputs.keyboard.D) {
            return new Actions.Walk({dir: 1});
        }

        // Idle
        return new Actions.Idle();
    }
};