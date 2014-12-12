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
        if (this.stats.godmode) {
            // Keyboard/mouse
            if (this.inputs.events.keydown && this.inputs.events.keydown.V) {
                this.stats.godmode = false;
            } else if (this.inputs.events.mousedown) {
                if (this.inputs.events.mousedown[0]) {
                    this.grabbed = this.instancePoint(0, this.view.x + (this.inputs.events.mousedown[0].x * this.view.scale), this.view.y + (this.inputs.events.mousedown[0].y * this.view.scale));
                }
            } else if (this.grabbed && this.inputs.events.mousemove) {
                this.grabbed.warp(this.view.x + (this.inputs.events.mousemove.x * this.view.scale), this.view.y + (this.inputs.events.mousemove.y * this.view.scale));
            } else if (this.grabbed && this.inputs.events.mouseup) {
                if (this.inputs.events.mouseup[0])
                    this.grabbed = false;
            } else if (this.inputs.events.keydown && this.inputs.events.keydown.C) {
                var block = new Platform();
                block.warp(this.x, this.y - 300, this.container);
            } else if (this.inputs.keyboard.D) {
                this.view.x += (this.view.speed * 2);
            } else if (this.inputs.keyboard.A) {
                this.view.x -= (this.view.speed * 2);
            }
            if (this.inputs.keyboard.S) {
                this.view.y += (this.view.speed * 2);
            } else if (this.inputs.keyboard.W) {
                this.view.y -= (this.view.speed * 2);
            }
        } else {
            // Keyboard/mouse
            if (this.inputs.events.keydown) {
                if (this.inputs.events.keydown.F) {
                    return new Actions.Attack({dir: this.facing}, 0.5);
                } else if (this.inputs.events.keydown.S && this.overActivatable) {
                    return new Actions.Activate({target: this.overActivatable});
                } else if (this.inputs.events.keydown.V) {
                    this.stats.godmode = true;
                }
            } else if (this.inputs.keyboard.W) {
                if (this.inputs.keyboard.A) {
                    return new Actions.Jump({dir: -1});
                } else if (this.inputs.keyboard.D) {
                    return new Actions.Jump({dir: 1});
                } else {
                    return new Actions.Jump({dir: 0});
                }
            } else if (this.inputs.keyboard.A) {
                return new Actions.Walk({dir: -1});
            } else if (this.inputs.keyboard.D) {
                return new Actions.Walk({dir: 1});
            }
        }

        // Idle
        return new Actions.Idle();
    }
};