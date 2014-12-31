/**
 * PlayerInput
 *
 * @module Anslem.Universe.Goals
 * @class PlayerInput
 * @static
 */
Goals.PlayerInput = {
    id: goalIdCounter++,
    description: "PlayerInput",
    label: "Player Goal",
    getAction: function () {
        // Zombiefy on disconnect
        if (!this.client) {
            this.baseGoal = Goals.EatBrains;
            return new Actions.Idle();
        }

        // Debug
        if (this.client.inputs.events.keyup && this.client.inputs.events.keyup.O) {
            var counts = {};
            for (id in this.container.contents['entity']) {
                var e = this.container.contents['entity'][id];
                if (!counts[e.goal.label])
                    counts[e.goal.label] = 0;
                counts[e.goal.label]++;
            }
            console.log(counts);
        }

        // Respond to  user input
        if (this.client.info.touchDevice)
            return Goals.RespondToTouch.getAction.call(this);
        return Goals.RespondToKeyboardMouse.getAction.call(this);
    }
};