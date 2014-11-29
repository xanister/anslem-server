/**
 * Compile all goals and return module
 *
 * @module Anslem.Universe.scripts
 * @requires fs
 */
var fs = require('fs');

var targetFile = __dirname + '/Goals.compiled.js';

var filesArray = [__dirname + '/Goals.js'];
fs.readdirSync(__dirname + '/goals').forEach(function (file) {
    if (file.match(/.+\.js/g) !== null) {
        filesArray.push(__dirname + '/goals/' + file);
    }
});

var out = filesArray.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out.push("module.exports = Goals;");
fs.writeFileSync(targetFile, out.join('\n'), 'utf-8');
console.log(' ' + targetFile + ' built.');

module.exports = require(targetFile);