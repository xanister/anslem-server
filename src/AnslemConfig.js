/**
 * Basic global configuration
 *
 * @module Anslem
 */

/**
 * Server and world config
 *
 * @class AnslemConfig
 * @static
 */
var AnslemConfig = {
    assetPath: "/var/www/assets.anslemgalaxy.com",
    gravity: 1.8,
    serverInfoInterval: 10000,
    linearDampening: 0.5,
    port: 3000,
    serverFps: 60,
    viewScale: 2,
    viewSpeed: 0.3,
    viewXBuffer: 0.2,
    viewYBuffer: 0.1
};

module.exports = AnslemConfig;
