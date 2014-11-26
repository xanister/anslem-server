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
            if (this.inputs.touches.x < this.view.width / 2) {
                return new Actions.Move({dir: -1});
            } else if (this.inputs.touches.x > this.view.width / 2) {
                return new Actions.Move({dir: 1});
            }
        }

        return false;
    }
};