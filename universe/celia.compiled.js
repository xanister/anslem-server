var Actions = {}; var Goals = {};
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        this.xSpeed += (params.dir * 5);
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
        if (this.clientConnection.inputs.A) {
            return new Actions.Move({dir: -1});
        } else if (this.clientConnection.inputs.D || this.clientConnection.inputs.touchCount > 0) {
            return new Actions.Move({dir: 1});
        }
        return false;
    }
};
module.exports = Goals;