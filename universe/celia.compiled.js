var Actions = {}; var Goals = {};
Actions.Jump = function Jump() {
    Jump.description = "Jump";
    Jump.label = "Jump";
    this.params = false;
    Jump.prototype.run = function () {
        this.ySpeed -= 20;
    };
};
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        this.xSpeed += (params.dir * 2);
    };
};
Goals.EatBrains = {
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        return false;
    }
};
Goals.Player = {
    description: "Player",
    label: "Player Goal",
    getAction: function () {
        // Desktop Controls
        if (this.ySpeed === 0 && this.inputs.events.keydown.W) {
            return new Actions.Jump();
        } else if (this.inputs.keyboard.A) {
            return new Actions.Move({dir: -1});
        } else if (this.inputs.keyboard.D) {
            return new Actions.Move({dir: 1});
        }

        // Mobile controls
        if (this.ySpeed === 0 && this.inputs.events.swipe.up) {
            return new Actions.Jump();
        } else if (this.inputs.touches[0]) {
            if ((this.inputs.touches[0].x * this.view.scale) + this.view.x > this.position.x) {
                return new Actions.Move({dir: 1});
            } else if ((this.inputs.touches[0].x * this.view.scale) + this.view.x < this.position.x) {
                return new Actions.Move({dir: -1});
            }
        }

        // No action
        return false;
    }
};
module.exports = Goals;