/**
 * Compile all goals and actions then return module
 *
 * @module Anslem.Universe.scripts
 * @requires fs
 */
var fs = require('fs');
var AnslemServerConfig = require("../app/AnslemServerConfig");

// Recursivly search for files, sorted
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

// Generate file data
var out = [];
out = out.concat(getFiles(__dirname + "/actions"));
out = out.concat(getFiles(__dirname + "/goals"));
out = out.concat(getFiles(__dirname + "/ideas"));
out = out.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out = [
    "var Anslem = {};",
    "var Actions = {}; var actionIdCounter = 1;",
    "var Goals = {}; var goalIdCounter = 1;",
    "var Ideas = {};",
    "var Population = {}",
    "var Sprites = require('./Sprites');",
    "var UniverseConfig = require('./UniverseConfig');"
].concat(out);
out = out.concat([
    "for (var name in Goals)",
    "Goals[Goals[name].id] = Goals[name];",
    "module.exports = Anslem;"
]);

// Write to file
fs.writeFileSync(__dirname + "/anslem.compiled.js", out.join('\n\n'), 'utf-8');
console.log(__dirname + "/anslem.compiled.js built.");

module.exports = require(__dirname + "/anslem.compiled.js");
