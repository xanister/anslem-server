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
    getAction: function () {
        if (this.hasCategory("alive"))
            return new Actions.Die();

        // Respawn for testing
        if (this.inputs && ((this.inputs.events.keydown && this.inputs.events.keydown.R) || this.inputs.events.swipeup)) {
            this.stats.health = 100;
            this.baseGoal = Goals.PlayerInput;
            this.addCategory('physical');
            this.addCategory("alive");
            if (this.sprite.name === "goblin") {
                this.addCategory('hasbrains');
                this.setSprite("warrior");
            } else {
                this.setSprite("skeleton");
            }
        }
        if (!this.inputs && ((new Date()).getTime() > (this.stats.timeOfDeath + 60000))) {
            this.stats.health = 100;
            this.baseGoal = Goals.EatBrains;
            this.addCategory('physical');
            this.addCategory("alive");
        }
        return new Actions.Idle();
    }
};