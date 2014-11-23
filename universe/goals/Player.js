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