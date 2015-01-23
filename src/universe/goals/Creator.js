/**
 * Creator
 *
 * @module Anslem.Universe.Goals
 * @class Creator
 * @static
 */
Goals.Creator = {
    id: goalIdCounter++,
    description: "Creator",
    label: "Player Goal",
    getAction: function () {
        // Toggle creator mode
        if ((this.client.inputs.events.keydown && this.client.inputs.events.keydown.V) || this.client.inputs.events.swipeup) {
            this.stats.godmode = false;
        }

        // Create ideas
        if (this.client.inputs.events.message) {
            if (this.client.inputs.events.message && Anslem[this.client.inputs.events.message]) {
                var newIdea = new Anslem[this.client.inputs.events.message];

                if (newIdea.constructor.name === "Entity") {
                    newIdea.setSprite("celia");
                    newIdea.gender = "female";
                    newIdea.label = newIdea.getRandomName();
                    newIdea.baseGoal = Goals.FartAround;
                }

                newIdea.warp(this.x, this.y - 300, this.container);
            }
        }

        // Move ideas
        if (this.client.inputs.events.mousedown) {
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
        } else if (this.client.inputs.events.touchstart) {
            var touch = this.client.inputs.events.touchstart[Object.keys(this.client.inputs.events.touchstart)[0]];
            this.grabbed = this.instancePoint("physical", this.view.x + (touch.x * this.view.scale), this.view.y + (touch.y * this.view.scale));
        } else if (this.grabbed && this.client.inputs.events.touchmove) {
            var touch = this.client.inputs.events.touchmove[Object.keys(this.client.inputs.events.touchmove)[0]];
            this.grabbed.warp(this.view.x + (touch.x * this.view.scale), this.view.y + (touch.y * this.view.scale));
        } else if (this.grabbed && this.client.inputs.events.touchend) {
            this.grabbed = false;
        }

        // Move view
        if (this.client.inputs.keyboard.D) {
            this.view.x += (this.view.speed * 2);
        } else if (this.client.inputs.keyboard.A) {
            this.view.x -= (this.view.speed * 2);
        }
        if (this.client.inputs.keyboard.S) {
            this.view.y += (this.view.speed * 2);
        } else if (this.client.inputs.keyboard.W) {
            this.view.y -= (this.view.speed * 2);
        } else if (!this.grabbed && this.client.inputs.touches.length === 1) {
            var touch = this.client.inputs.touches[Object.keys(this.client.inputs.touches)[0]];
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
        }

        // Zoom
        if (this.client.inputs.touches.length === 2 && this.client.inputs.events.touchmove) {
            var touch0 = this.client.inputs.touches[Object.keys(this.client.inputs.touches)[0]];
            var touch1 = this.client.inputs.touches[Object.keys(this.client.inputs.touches)[1]];
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
                this.updateView(true);
                this.client.trigger("viewUpdate", {width: this.view.width, height: this.view.height});
            }
        }

        // Idle
        return new Actions.Idle();
    }
};