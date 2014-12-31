/**
 * Skeleton
 *
 * @module Anslem.Universe
 */

/**
 * Player
 *
 * @class Skeleton
 * @constructor
 * @extends Entity
 */
function Skeleton() {
    Entity.call(this);
    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = Goals.EatBrains;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('undead');

    /**
     * Label
     *
     * @property label
     * @type {String}
     */
    this.label = "Skeleton";

    /*
     * Skeleton defaults
     */
    this.setSprite("skeleton02");
    this.stats.speed *= (0.1 + (Math.random() * 0.4));
}
Skeleton.prototype = new Entity();
Skeleton.prototype.constructor = Skeleton;

Anslem.Skeleton = Skeleton;
