/**
 * Goals.js
 * Compile all actions and goals and return Goals module
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 */

/**
 * Includes
 */
var fs = require('fs');

/**
 * Compiled file path
 * @type String
 */
var targetFile = __dirname + '/celia.compiled.js';

// Grab filenames
var filesArray = [];
fs.readdirSync(__dirname + '/actions').forEach(function (file) {
    if (file.match(/.+\.js/g) !== null) {
        filesArray.push(__dirname + '/actions/' + file);
    }
});
fs.readdirSync(__dirname + '/goals').forEach(function (file) {
    if (file.match(/.+\.js/g) !== null) {
        filesArray.push(__dirname + '/goals/' + file);
    }
});

// Compile
var out = filesArray.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out.unshift("var Actions = {}; var Goals = {};");
out.push("module.exports = Goals;");
fs.writeFileSync(targetFile, out.join('\n'), 'utf-8');
console.log(' ' + targetFile + ' built.');

module.exports = require(targetFile);