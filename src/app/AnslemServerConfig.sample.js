/**
 * Basic global configuration
 *
 * @module Anslem
 */

/**
 * Server config
 *
 * @class AnslemServerConfig
 * @static
 */
var AnslemServerConfig = {
    /**
     * Path to asset server
     *
     * @property assetPath
     * @type {String}
     */
    assetPath: "/var/www/assets.anslemgalaxy.com",
    /**
     * Environment
     *
     * @propert environment
     * @type {String}
     */
    environment: 'production',
    /**
     * Network fps
     *
     * @property networkFps
     * @type {Number}
     */
    networkFps: 30,
    /**
     * Server info log interval
     *
     * @property serverInfoInterval
     * @type {Number}
     */
    serverInfoInterval: 10000,
    /**
     * Default listen port
     *
     * @property port
     * @type {Number}
     */
    port: 3010,
    /**
     * Universe fps
     *
     * @property universeFps
     * @type {Number}
     */
    universeFps: 60,
    /**
     * Standard fps to measure agains
     *
     * @property standardFps
     * @type {Number}
     */
    standardFps: 60
};

// Scale attributes for framerate
AnslemServerConfig.fpsFactor = AnslemServerConfig.standardFps / AnslemServerConfig.serverFps;
module.exports = AnslemServerConfig;
