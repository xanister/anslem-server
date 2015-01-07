/**
 * Dead
 *
 * @module Anslem.Universe.Goals
 * @class Dead
 * @static
 */
Goals.Dead = {
    id: goalIdCounter++,
    description: "Dead",
    label: "Dead",
    params: false,
    getAction: function () {
        // Respawn for testing
        if (this.client && this.client.inputs && ((this.client.inputs.events.keydown && this.client.inputs.events.keydown.R) || this.client.inputs.events.swipeup)) {
            return new Actions.Respawn();
        }
        if (!this.client && ((new Date()).getTime() > (this.stats.timeOfDeath + 60000))) {
            return new Actions.Respawn();
        }
        return new Actions.Idle();
    }
};