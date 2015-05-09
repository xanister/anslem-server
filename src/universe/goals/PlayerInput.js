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

        // Respond to  user input
        if (this.stats.godmode)
            return Goals.Creator.getAction.call(this);
        if (this.client.info.pixelRatio > 1)
            return Goals.RespondToTouch.getAction.call(this);
        return Goals.RespondToKeyboardMouse.getAction.call(this);
    }
};