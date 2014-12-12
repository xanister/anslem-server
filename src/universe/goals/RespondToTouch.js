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
        if (this.stats.godmode) {
            // Touch
            if (this.inputs.events.swipeup) {
                this.stats.godmode = false;
            } else if (this.inputs.events.touchstart) {
                var touch = this.inputs.events.touchstart[Object.keys(this.inputs.events.touchstart)[0]];
                this.grabbed = this.instancePoint(0, this.view.x + (touch.x * this.view.scale), this.view.y + (touch.y * this.view.scale));
            } else if (this.grabbed && this.inputs.events.touchmove) {
                var touch = this.inputs.events.touchmove[Object.keys(this.inputs.events.touchmove)[0]];
                this.grabbed.warp(this.view.x + (touch.x * this.view.scale), this.view.y + (touch.y * this.view.scale));
            } else if (this.grabbed && this.inputs.events.touchend) {
                this.grabbed = false;
            } else if (!this.grabbed && this.inputs.touches.length === 1) {
                var touch = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                if (touch.x > touch.startX) {
                    this.view.x += (this.view.speed * 2);
                } else if (touch.x < touch.startX) {
                    this.view.x -= (this.view.speed * 2);
                }
                if (touch.y > touch.startY) {
                    this.view.y += (this.view.speed * 2);
                } else if (touch.y < touch.startY) {
                    this.view.y -= (this.view.speed * 2);
                }
            } else if (this.inputs.touches.length === 2 && this.inputs.events.touchmove) {
                var touch0 = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                var touch1 = this.inputs.touches[Object.keys(this.inputs.touches)[1]];
                var touchDist0 = touch0.x - touch0.startX;
                var touchDist1 = touch1.x - touch1.startX;
                if (Math.abs(touchDist0) > 5 && Math.abs(touchDist1) > 5) {
                    var pinchDistStart = Math.sqrt(Math.pow(touch0.startX - touch1.startX, 2) + Math.pow(touch0.startY - touch1.startY, 2));
                    var pinchDistEnd = Math.sqrt(Math.pow(touch0.x - touch1.x, 2) + Math.pow(touch0.y - touch1.y, 2));
                    var pinchDistance = pinchDistStart - pinchDistEnd;
                    this.view.scale += (pinchDistance / this.view.width);
                    this.view.scale = Math.floor(this.view.scale * 10000) / 10000;
                    if (this.view.scale < 0.1)
                        this.view.scale = 0.1;
                    else if (this.view.scale > 4)
                        this.view.scale = 4;
                    this.initializeView(this.view.scale);
                    this.client.sendViewUpdate(this.view);
                }
            } else if (this.inputs.events.swipedown) {
                var block = new Platform();
                block.warp(this.x, this.y - 300, this.container);
            }
        } else {
            // Touch
            if (this.inputs.touches.length === 4) {
                this.stats.godmode = true;
            } else if (this.inputs.touches.length === 2 || this.inputs.events.swipeup) {
                return new Actions.Jump({dir: 0});
            } else if (this.inputs.events.swiperight) {
                return new Actions.Attack({dir: 1}, 0.5);
            } else if (this.inputs.events.swipeleft) {
                return new Actions.Attack({dir: -1}, 0.5);
            } else if (this.inputs.events.swipedown && this.overActivatable) {
                return new Actions.Activate({target: this.overActivatable});
            } else if (this.inputs.touches.length === 1) {
                var touch = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                var dist = 0.25 + ((Math.min(Math.abs(touch.x - touch.startX), 100) / 100) * 0.75);
                // TODO: Fix speed control
                if (touch.x > touch.startX) {
                    return new Actions.Walk({dir: 1});
                } else if (touch.x < touch.startX) {
                    return new Actions.Walk({dir: -1});
                }
            }
        }

        // Idle
        return new Actions.Idle();
    }
};