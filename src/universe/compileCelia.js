/**
 * Compile all goals and actions then return module
 *
 * @module Anslem.Universe.scripts
 * @requires fs
 */
var fs = require('fs');

var targetFile = __dirname + '/celia.compiled.js';

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

var out = filesArray.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out.unshift("var Actions = {};", "var Goals = {};");
out.push("module.exports = Goals;");
fs.writeFileSync(targetFile, out.join('\n\n'), 'utf-8');
console.log(' ' + targetFile + ' built.');

module.exports = require(targetFile);
