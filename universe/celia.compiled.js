var Actions = {}; var Goals = {};
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        this.position.x += params.dir;
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
        } else if (this.clientConnection.inputs.D) {
            return new Actions.Move({dir: 1});
        }
        return false;
    }
};
module.exports = Goals;