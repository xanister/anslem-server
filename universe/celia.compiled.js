var Actions = {}; var Goals = {};
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
        if (this.inputs.keyboard.A) {
            return new Actions.Move({dir: -1});
        } else if (this.inputs.keyboard.D) {
            return new Actions.Move({dir: 1});
        }

        if (this.inputs.touches.x) {
            if (this.inputs.touches.x < (this.view.width / this.view.scale) / 2) {
                return new Actions.Move({dir: -1});
            } else if (this.inputs.touches.x > (this.view.width / this.view.scale) / 2) {
                return new Actions.Move({dir: 1});
            }
        }

        return false;
    }
};
module.exports = Goals;