Goals.Player = {
    description: "Player",
    label: "Player Goal",
    getAction: function () {
        var inputs = this.clientConnection.inputs;
        var touches = inputs.touches || false;

        if (touches) {
            return new Actions.Move({dir: 1});
        } else {
            if (inputs.A) {
                return new Actions.Move({dir: -1});
            } else if (this.clientConnection.inputs.D || this.clientConnection.inputs.touchCount > 0) {
                return new Actions.Move({dir: 1});
            }
        }
        return false;
    }
};