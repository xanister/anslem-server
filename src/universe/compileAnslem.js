/**
 * Compile all goals and actions then return module
 *
 * @module Anslem.Universe.scripts
 * @requires fs
 */
var fs = require('fs');

function getFiles(path) {
    var files = [];
    var dirlist = fs.readdirSync(path);
    for (var index in dirlist) {
        var file = path + "/" + dirlist[index];
        if (file.match(/.+\.js/g) === null) {
            files = files.concat(getFiles(file));
        } else {
            files.unshift(file);
        }
    }
    return files;
}

var out = [];
out = out.concat(getFiles(__dirname + "/actions"));
out = out.concat(getFiles(__dirname + "/goals"));
out = out.concat(getFiles(__dirname + "/ideas"));
out = out.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out = [
    "var Anslem = {};",
    "var Actions = {};",
    "var Goals = {};",
    "var Idea = require('./Idea');",
    "var Sprites = require('./Sprites');",
    "var UniverseConfig = require('./UniverseConfig');"
].concat(out);
out = out.concat([
    "module.exports = Anslem;"
]);
fs.writeFileSync(__dirname + "/anslem.compiled.js", out.join('\n\n'), 'utf-8');
console.log(__dirname + "/anslem.compiled.js built.");

module.exports = require(__dirname + "/anslem.compiled.js");
