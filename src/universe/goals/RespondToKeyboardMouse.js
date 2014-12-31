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
        if (this.client.inputs.keyboard.M) {
            console.log(this.getPacket(true));
        }

        if (this.stats.godmode) {
            if (this.client.inputs.events.keydown && this.client.inputs.events.keydown.V) {
                this.stats.godmode = false;
            } else if (this.client.inputs.events.mousedown) {
                if (this.client.inputs.events.mousedown[0]) {
                    this.grabbed = this.instancePoint(0, this.view.x + (this.client.inputs.events.mousedown[0].x * this.view.scale), this.view.y + (this.client.inputs.events.mousedown[0].y * this.view.scale));
                    if (this.grabbed) {
                        this.grabbed.sprite.tint = 0xFF0000;
                    }
                }
            } else if (this.grabbed && this.client.inputs.events.mousemove) {
                this.grabbed.warp(this.view.x + (this.client.inputs.events.mousemove.x * this.view.scale), this.view.y + (this.client.inputs.events.mousemove.y * this.view.scale));
            } else if (this.grabbed && this.client.inputs.events.mouseup) {
                if (this.client.inputs.events.mouseup[0]) {
                    this.grabbed.sprite.tint = 0xFFFFFF;
                    this.grabbed = false;
                }
            } else if (this.client.inputs.events.keydown && this.client.inputs.events.keydown.C) {
                var newIdea = new House01();
                newIdea.warp(this.x, this.y - 300, this.container);
            } else if (this.client.inputs.keyboard.D) {
                this.view.x += (this.view.speed * 2);
            } else if (this.client.inputs.keyboard.A) {
                this.view.x -= (this.view.speed * 2);
            }
            if (this.client.inputs.keyboard.S) {
                this.view.y += (this.view.speed * 2);
            } else if (this.client.inputs.keyboard.W) {
                this.view.y -= (this.view.speed * 2);
            }
        } else {
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
        }

        // Idle
        return new Actions.Idle();
    }
};