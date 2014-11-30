/**
 * Available actions
 *
 * @module Anslem.Universe.scripts
 */

/**
 * Actions list object
 *
 * @class Actions
 * @static
 */
var Actions = {};
/**
 * Action template
 *
 * @class ActionTemplate
 * @constructor
 * @param {Object} params optional params for action
 */
Actions.ActionTemplate = function ActionTemplate(params) {
    /**
     * Basic description
     *
     * @property description
     * @type {String}
     */
    this.description = "Action template description";

    /**
     * Basic label or name
     *
     * @property label
     * @type {String}
     */
    this.label = "Action Template";

    /**
     * Parameters for the action, defined per action basis
     *
     * @property params
     * @type {Object}
     */
    this.params = params || {};

    /**
     * How far the action has progressed so far in frames
     *
     * @property progress
     * @type {Number}
     */
    this.progress = 0;

    /**
     * How many frames it takes to do one complete action
     *
     * @property description
     * @type {String}
     */
    this.speed = 0;

    /**
     * Sets animation. This method gets called in the context of the calling entity
     *
     * @method updateAnimation
     */
    ActionTemplate.prototype.updateAnimation = function () {
        // Determine animation here...
        this.setAnimation("default");
    };

    /**
     * Run the action. This method gets called in the context of the calling entity
     *
     * @method run
     * @param {Object} params action parameters defined at creation
     */
    ActionTemplate.prototype.run = function (params) {
        // Do whatever needs to be done
    };
};
/**
 * Attack with whatever I am holding
 *
 * @class Attack
 * @constructor
 * @for Actions
 * @param {Object} params {dir: 1 || -1, strength: 10}
 */
Actions.Attack = function Attack(params) {
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Attack.prototype.run = function (params) {
        this.facing = params.dir;

        var hit = this.instancePlace("physical", this.x + (50 * params.dir), this.y);
        if (hit && hit.immunityTimeout === 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: 10});
            hit.immunityTimeout = this.action.speed;
        }
    };
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack");
    };
};
/**
 * Take a hit
 *
 * @class Flinch
 * @constructor
 * @for Actions
 * @param {Object} params {dir: 1 || -1, strength: 5}
 */
Actions.Flinch = function Flinch(params) {
    this.description = "Take a hit";
    this.label = "Flinch";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Flinch.prototype.run = function (params) {
        if (this.action.progress === 0) {
            this.xSpeed += (params.strength * params.dir);
            this.ySpeed -= (params.strength * 0.5);
        }
    };
    Flinch.prototype.updateAnimation = function () {
        this.setAnimation("flinch");
    };
};
/**
 * Idle
 *
 * @class Idle
 * @constructor
 * @for Actions
 */
Actions.Idle = function Idle() {
    this.description = "Idle";
    this.label = "Idle";
    this.params = false;
    this.progress = 0;
    this.speed = 1;
    Idle.prototype.run = function () {

    };
    Idle.prototype.updateAnimation = function () {
        if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else if (this.xSpeed !== 0)
            this.setAnimation("walk");
        else
            this.setAnimation("default");
    };
};
/**
 * Jump
 *
 * @class Jump
 * @constructor
 * @for Actions
 */
Actions.Jump = function Jump() {
    this.description = "Jump";
    this.label = "Jump";
    this.params = false;
    this.progress = 0;
    this.speed = 5;
    Jump.prototype.run = function () {
        if (this.action.progress === 0)
            this.ySpeed -= this.stats.jump;
    };
    Jump.prototype.updateAnimation = function () {
        this.setAnimation("jump");
    };
};
/**
 * Walk
 *
 * @class Walk
 * @constructor
 * @for Actions
 * @param {Object} params direction to move, {dir: 1 || -1}
 */
Actions.Walk = function Walk(params) {
    this.description = "Walk";
    this.label = "Walk";
    this.params = params;
    this.progress = 0;
    this.speed = 1;
    Walk.prototype.run = function (params) {
        this.facing = params.dir;

        if ((this.xSpeed < this.stats.speed && params.dir === 1) || (this.xSpeed > -this.stats.speed && params.dir === -1))
            this.xSpeed += (params.dir * this.stats.accel);
    };
    Walk.prototype.updateAnimation = function () {
        if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else
            this.setAnimation("walk", this.sprite.src["walk"].frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed));
    };
};
module.exports = Actions;