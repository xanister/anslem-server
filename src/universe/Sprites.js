/**
 * List of available sprites and their info
 *
 * @module Anslem.assets
 * @requires AnslemServerConfig, fs, image-size
 */
var AnslemServerConfig = require('../app/AnslemServerConfig');
var UniverseConfig = require('./UniverseConfig');
var fs = require('fs');
var sizeOf = require('image-size');

/**
 * Available sprites
 *
 * @class Sprites
 * @static
 */
var Sprites = {};

// Load additional sprites from json definition files
fs.readdirSync(__dirname + '/sprites.' + UniverseConfig.theme).forEach(function (file) {
    var spriteJson = fs.readFileSync(__dirname + '/sprites.' + UniverseConfig.theme + "/" + file);
    try {
        var sprites = JSON.parse(spriteJson);
        for (var name in sprites) {
            Sprites[name] = sprites[name];
        }
    }
    catch (err) {
        console.log("JSON parse error on " + file);
        console.log(err);
    }
});

// Setup initial sprite info
for (var index in Sprites) {
    for (var animation in Sprites[index]) {
        var dim = sizeOf(AnslemServerConfig.assetPath + Sprites[index][animation].imagePath + (Sprites[index][animation].singleImage ? "" : "__000") + ".png");

        Sprites[index][animation].width = Sprites[index][animation].singleImage ? dim.width / Sprites[index][animation].frameCount : dim.width;
        Sprites[index][animation].height = dim.height;
        Sprites[index][animation].xOffset = Sprites[index][animation].xOffset || 0;
        Sprites[index][animation].yOffset = Sprites[index][animation].yOffset || 0;
    }
}

module.exports = Sprites;
