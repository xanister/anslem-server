/**
 * Basic universe configuration
 *
 * @module Anslem
 */

/**
 * World config
 *
 * @class UniverseConfig
 * @static
 */
var UniverseConfig = {
    /**
     * Frames to keep bubbles active
     *
     * @property bubbleTime
     * @type {Number}
     */
    bubbleTime: 60,
    /**
     * Default view scale
     *
     * @property viewScale
     * @type {Number}
     */
    viewScale: 0.5,
    /**
     * Default view scale
     *
     * @property viewScale
     * @type {Number}
     */
    viewScaleStandard: 2,
    /**
     * Default view speed
     *
     * @property viewSpeed
     * @type {Number}
     */
    viewSpeed: 2,
    /**
     * Distance to keep between player and view border,
     * percent of view width
     *
     * @property viewXBuffer
     * @type {Number}
     */
    viewXBuffer: 0.3,
    /**
     * Distance to keep between player and view border,
     * percent of view height
     *
     * @property viewXBuffer
     * @type {Number}
     */
    viewYBuffer: 0.4
};

/**
 * Scaling factor
 *
 * @property scaleFactor
 * @type {Number}
 */
UniverseConfig.scaleFactor = UniverseConfig.viewScale / UniverseConfig.viewScaleStandard;

/**
 * Default gravity
 *
 * @property gravity
 * @type {Number}
 */
UniverseConfig.gravity = 1.8 * UniverseConfig.scaleFactor;

/**
 * Default linear dampening
 *
 * @property linearDampening
 * @type {Number}
 */
UniverseConfig.linearDampening = 0.5 * UniverseConfig.scaleFactor;

/**
 * Default stats for all entities
 *
 * @property defaultEntityStats
 * @type {Object}
 */
UniverseConfig.defaultEntityStats = {
    accel: 1.1 * UniverseConfig.scaleFactor,
    health: 100,
    perception: 800,
    jump: 25 * UniverseConfig.scaleFactor,
    speed: 15 * UniverseConfig.scaleFactor,
    strength: 25 * UniverseConfig.scaleFactor
};

console.log(UniverseConfig);
module.exports = UniverseConfig;
