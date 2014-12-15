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
        accel: 0.3,
        health: 100,
        perception: 900,
        jump: 25,
        speed: 19,
        strength: 10
    },
    /**
     * Framerate factor
     *
     * @property fpsFactor
     * @type {Number}
     */
    fpsFactor: 1,
    /**
     * Default gravity
     *
     * @property gravity
     * @type {Number}
     */
    gravity: 2.3,
    /**
     * Frames between view updates
     *
     * @property inViewUpdateDelay
     * @type {Number}
     */
    inViewUpdateDelay: 10,
    /**
     * Default linear dampening
     *
     * @property linearDampening
     * @type {Number}
     */
    linearDampening: 0.2,
    /**
     * Scaling factor
     *
     * @property scaleFactor
     * @type {Number}
     */
    scaleFactor: 1,
    /**
     * Theme for sprites
     *
     * @property theme
     * @type {String}
     */
    theme: "highres",
    /**
     * Universe fps
     *
     * @property universeFps
     * @type {Number}
     */
    universeFps: 60,
    /**
     * Default view scale
     *
     * @property viewScale
     * @type {Number}
     */
    viewScale: 2.5,
    /**
     * Default view speed
     *
     * @property viewSpeed
     * @type {Number}
     */
    viewSpeed: 2,
    /**
     * Default viewXBuffer
     *
     * @property viewXBuffer
     * @type {Number}
     */
    viewXBuffer: 0.45,
    /**
     * Default viewYBuffer
     *
     * @property viewYBuffer
     * @type {Number}
     */
    viewYBuffer: 0.25
};

module.exports = UniverseConfig;
