/**
 * RespondToTouch
 *
 * @module Anslem.Universe.Goals
 * @class RespondToTouch
 * @static
 */
Goals.RespondToTouch = {
    id: goalIdCounter++,
    description: "RespondToTouch",
    label: "Player Goal",
    getAction: function () {
        // Touch
        if (this.client.inputs.touches.length === 4) {
            this.stats.godmode = true;
        } else if (this.client.inputs.events.swiperight) {
            return new Actions.Attack({dir: 1}, 0.5);
        } else if (this.client.inputs.events.swipeleft) {
            return new Actions.Attack({dir: -1}, 0.5);
        } else if (this.client.inputs.events.swipedown && this.overActivatable) {
            return new Actions.Activate({target: this.overActivatable});
        } else if (this.client.inputs.touches.length === 2 || this.client.inputs.events.swipeup) {
            var touch = this.client.inputs.touches[Object.keys(this.client.inputs.touches)[0]];
            var dist = Math.sqrt(Math.pow(touch.startX - touch.x, 2) + Math.pow(touch.startX - touch.x, 2));
            if (touch.x > touch.startX) {
                return new Actions.Jump({dir: dist / 100});
            } else if (touch.x < touch.startX) {
                return new Actions.Jump({dir: -dist / 100});
            }
            return new Actions.Jump({dir: 0});
        } else if (this.client.inputs.touches.length === 1) {
            var touch = this.client.inputs.touches[Object.keys(this.client.inputs.touches)[0]];
            var dist = Math.min(Math.sqrt(Math.pow(touch.startX - touch.x, 2) + Math.pow(touch.startX - touch.x, 2)), 150);
            if (touch.x > touch.startX) {
                return new Actions.Walk({dir: dist / 50});
            } else if (touch.x < touch.startX) {
                return new Actions.Walk({dir: -dist / 50});
            }
        }

        // Idle
        return new Actions.Idle();
    }
};