/**
 * Compile all goals and actions then return module
 *
 * @module Anslem.Universe.scripts
 * @requires fs
 */
var fs = require('fs');

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
out = out.concat(getFiles(__dirname + "/regions"));
out = out.concat(getFiles(__dirname + "/actions"));
out = out.concat(getFiles(__dirname + "/goals"));
out = out.concat(getFiles(__dirname + "/ideas"));
out = out.map(function (filePath) {
    return fs.readFileSync(filePath, 'utf-8');
});
out = [
    "var exec = require('child_process').exec;",
    "var Anslem = {};",
    "var AnslemServerConfig = require('../app/AnslemServerConfig');",
    "var Regions = {}",
    "var Actions = {}; var actionIdCounter = 1;",
    "var async = require('async');",
    "var Goals = {}; var goalIdCounter = 1;",
    "var Ideas = {};",
    "var Population = {}",
    "var Sprites = require('./Sprites');",
    "var UniverseConfig = require('./UniverseConfig');"
].concat(out);
out = out.concat([
    "Anslem.Regions = Regions;",
    "Anslem.Actions = Actions;",
    "Anslem.Goals = Goals;",
    "Anslem.Ideas = Ideas;",
    "Anslem.Population = Population;",
    "Anslem.Sprites = Sprites;",
    "Anslem.Config = UniverseConfig;",
    "module.exports = Anslem;"
]);

// Write to file
fs.writeFileSync(__dirname + "/anslem.compiled.js", out.join('\n\n'), 'utf-8');
console.log(__dirname + "/anslem.compiled.js built.");

module.exports = require(__dirname + "/anslem.compiled.js");
