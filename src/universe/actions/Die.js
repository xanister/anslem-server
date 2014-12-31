/**
 * Die
 *
 * @module Anslem.Universe.Actions
 * @class Die
 * @constructor
 */
function Die() {
    this.id = actionIdCounter++;
    this.description = "Die";
    this.label = "Die";
    this.params = false;
    this.progress = 0;
    this.speed = 20;
    Die.prototype.run = function () {
        if (this.baseGoal !== Goals.Dead) {
            this.stats.timeOfDeath = (new Date()).getTime();
            this.removeCategory("alive");
            this.removeCategory('hasbrains');
            this.removeCategory('physical');
            this.goal = false;
            this.baseGoal = Goals.Dead;
        }
    };
    Die.prototype.updateAnimation = function () {
        this.setAnimation("die");
    };
}
Actions.Die = Die;