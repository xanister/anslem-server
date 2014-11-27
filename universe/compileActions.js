/**
 * compileActions.js
 * Compile all actions and return module
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 *
 * @module Anslem
 * @requires fs, Actions
 */
var fs = require('fs');

var targetFile = __dirname + '/Actions.compiled.js';

var filesArray = [__dirname + '/Actions.js'];
fs.readdirSync(__dirname + '/actions').forEach(function (file) {
    if (file.match(/.+\.js/g) !== null) {
        filesArray.push(__dirname + '/actions/' + file);
    }
});

var out = filesArray.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out.push("module.exports = Actions;");
fs.writeFileSync(targetFile, out.join('\n'), 'utf-8');
console.log(' ' + targetFile + ' built.');

module.exports = require(targetFile);