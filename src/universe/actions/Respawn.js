/**
 * Respawn
 *
 * @module Anslem.Universe.Actions
 * @class Respawn
 * @constructor
 */
function Respawn() {
    this.id = actionIdCounter++;
    this.description = "Respawn";
    this.label = "Respawn";
    this.params = false;
    this.progress = 0;
    this.speed = 5;
    Respawn.prototype.run = function () {
        if (this.action.progress === 4) {
            this.stats.health = 100;
            this.addCategory("alive");
            this.addCategory('physical');
            if (this.client) {
                this.addCategory("undead");
                this.setSprite("skeleton01");
                this.baseGoal = Goals.PlayerInput;
            } else {
                this.baseGoal = Goals.EatBrains;
            }
        }
    };
    Respawn.prototype.updateAnimation = function () {
        this.setAnimation("die");
    };
}
Actions.Respawn = Respawn;