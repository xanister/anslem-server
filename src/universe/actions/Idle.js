/**
 * Idle
 *
 * @class Idle
 * @constructor
 * @for Actions
 */
Actions.Idle = function Idle() {
    Idle.description = "Idle";
    Idle.label = "Idle";
    this.params = false;
    Idle.prototype.run = function () {
        this.setSprite("sprGoblinIdle");
    };
};