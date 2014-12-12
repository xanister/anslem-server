/**
 * Activate with whatever I am holding
 *
 * @module Anslem.Universe.Actions
 * @class Activate
 * @constructor
 * @param {Object} params {target: {Idea}}
 */
function Activate(params) {
    this.id = actionIdCounter++;
    this.description = "Activate";
    this.label = "Activate";
    this.params = params;
    this.progress = 0;
    this.speed = 5;
    Activate.prototype.run = function (params) {
        if (this.action.progress === 4) {
            params.target.activate.call(params.target, this);
        }
    };
    Activate.prototype.updateAnimation = function () {
        this.setAnimation("idle");
    };
}
Actions.Activate = Activate;