/**
 * config.js
 * Basic configuration
 *
 * Author: Nicholas Frees
 * Date: 11/25/2014
 */

/**
 * Server and world config
 * @type {Object}
 */
var anslemConfig = {
    assetPath: "/var/www/assets.anslemgalaxy.com",
    gravity: 1.8,
    serverInfoInterval: 10000,
    linearDampening: 0.5,
    port: 3000,
    serverFps: 30,
    viewScale: 2,
    viewSpeed: 0.3,
    viewXBuffer: 0.2,
    viewYBuffer: 0.1
};

module.exports = anslemConfig;