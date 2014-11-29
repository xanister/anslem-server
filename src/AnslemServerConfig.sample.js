/**
 * Basic global configuration
 *
 * @module Anslem
 */

/**
 * Server and world config
 *
 * @class AnslemServerConfig
 * @static
 */
var AnslemServerConfig = {
    /**
     * Path to asset server
     *
     * @property assetPath
     * @type String
     */
    assetPath: "/var/www/assets.anslemgalaxy.com",
    /**
     * Default gravity
     *
     * @property gravity
     * @type Number
     */
    gravity: 1.8,
    /**
     * Server info log interval
     *
     * @property serverInfoInterval
     * @type Number
     */
    serverInfoInterval: 10000,
    /**
     * Default linear dampening
     *
     * @property linearDampening
     * @type Number
     */
    linearDampening: 0.5,
    /**
     * Default listen port
     *
     * @property port
     * @type Number
     */
    port: 3000,
    /**
     * Target server fps
     *
     * @property serverFps
     * @type Number
     */
    serverFps: 60,
    /**
     * Default view scale
     *
     * @property viewScale
     * @type Number
     */
    viewScale: 2,
    /**
     * Distance to keep between player and view border,
     * percent of view width
     *
     * @property viewXBuffer
     * @type Number
     */
    viewXBuffer: 0.2,
    /**
     * Distance to keep between player and view border,
     * percent of view height
     *
     * @property viewXBuffer
     * @type Number
     */
    viewYBuffer: 0.4
};

module.exports = AnslemServerConfig;
