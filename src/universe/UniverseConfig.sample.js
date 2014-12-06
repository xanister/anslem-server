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
     * Default stats for all entities
     *
     * @property defaultEntityStats
     * @type {Object}
     */
    defaultEntityStats: {
        accel: 1.8,
        health: 100,
        perception: 800,
        jump: 35,
        speed: 10,
        strength: 20
    },
    /**
     * Default gravity
     *
     * @property gravity
     * @type {Number}
     */
    gravity: 1.8,
    /**
     * Default linear dampening
     *
     * @property linearDampening
     * @type {Number}
     */
    linearDampening: 0.5,
    /**
     * Default view scale
     *
     * @property viewScale
     * @type {Number}
     */
    viewScale: 2,
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
    viewXBuffer: 0.2,
    /**
     * Distance to keep between player and view border,
     * percent of view height
     *
     * @property viewXBuffer
     * @type {Number}
     */
    viewYBuffer: 0.4
};

// Scale attributes for framerate
module.exports = UniverseConfig;
