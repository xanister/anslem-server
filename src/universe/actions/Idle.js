/**
 * Idle
 *
 * @method Idle
 * @for Actions
 */
Actions.Idle = function Idle() {
    Idle.description = "Idle";
    Idle.label = "Idle";
    this.params = false;
    Idle.prototype.run = function () {
        if (this.sprite.image !== "sprGoblin")
            this.setSprite("sprGoblin");
    };
};