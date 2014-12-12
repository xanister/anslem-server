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
        if (!this.client) {
            this.baseGoal = Goals.EatBrains;
            return new Actions.Idle();
        }

        if (this.client.info.touchDevice)
            return Goals.RespondToTouch.getAction.call(this);
        return Goals.RespondToKeyboardMouse.getAction.call(this);
    }
};