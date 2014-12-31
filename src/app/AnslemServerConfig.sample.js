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
    environment: 'dev1',
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
    port: 3011,
    /**
     * Region fps
     *
     * @property regionFps
     * @type {Number}
     */
    regionFps: 60,
    /**
     * Server address
     *
     * @property serverAddress
     * @type {String}
     */
    serverAddress: "devclient1.anslemgalaxy.com",
    /**
     * Server info log interval
     *
     * @property serverInfoInterval
     * @type {Number}
     */
    serverInfoInterval: 5000,
    /**
     * Save snapshots on interval
     *
     * @property snapshotInterval
     * @type {Number}
     */
    snapshotInterval: 300000,
    /**
     * Snap files to keep
     *
     * @property snapsToKeep
     * @type {Number}
     */
    snapsToKeep: 5
};

module.exports = AnslemServerConfig;
