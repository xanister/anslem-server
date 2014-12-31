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
//        if (!this.inputs && ((new Date()).getTime() > (this.stats.timeOfDeath + 60000))) {
//            this.stats.health = 100;
//            this.baseGoal = Goals.EatBrains;
//            this.addCategory('physical');
//            this.addCategory("alive");
//        }
        return new Actions.Idle();
    }
};