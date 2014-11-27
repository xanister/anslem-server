/**
 * Actions.js
 * Available actions
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 *
 * @module Anslem
 * @requires fs, Actions
 */
var fs = require('fs');

/**
 * Actions
 *
 * @class Actions
 * @static
 */
var Actions = {};
/**
 * Jump
 *
 * @method Jump
 * @for Actions
 */
Actions.Jump = function Jump() {
    Jump.description = "Jump";
    Jump.label = "Jump";
    this.params = false;
    Jump.prototype.run = function () {
        this.ySpeed -= 20;
    };
};
/**
 * Move
 *
 * @method Move
 * @for Actions
 * @param {Object} params direction to move
 */
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        this.xSpeed += (params.dir * 2);
    };
};
module.exports = Actions;