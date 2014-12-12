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
    networkFps: 60,
    /**
     * Default listen port
     *
     * @property port
     * @type {Number}
     */
    port: 3010,
    /**
     * Server info log interval
     *
     * @property serverInfoInterval
     * @type {Number}
     */
    serverInfoInterval: 60000,
    /**
     * Snap files to keep
     *
     * @property snapsToKeep
     * @type {Number}
     */
    snapsToKeep: 5
};

module.exports = AnslemServerConfig;
