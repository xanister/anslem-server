/**
 * Action template
 *
 * @module Anslem.Universe.Actions
 * @class ActionTemplate
 * @constructor
 * @param {Object} params optional params for action
 */
function ActionTemplate(params) {
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
     * @property speed
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
}
Actions.ActionTemplate = ActionTemplate;