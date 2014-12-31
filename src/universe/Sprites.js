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

        Sprites[index][animation].verticalCount = Sprites[index][animation].verticalCount || 1;
        Sprites[index][animation].verticalIndex = Sprites[index][animation].verticalIndex || 0;
        Sprites[index][animation].maxFrameCount = Sprites[index][animation].maxFrameCount || Sprites[index][animation].frameCount;
        Sprites[index][animation].frameSpeed *= UniverseConfig.fpsFactor;
        Sprites[index][animation].width = Sprites[index][animation].singleImage ? dim.width / Sprites[index][animation].maxFrameCount : dim.width;
        Sprites[index][animation].height = Sprites[index][animation].singleImage ? dim.height / Sprites[index][animation].verticalCount : dim.height;
        Sprites[index][animation].leftOffset = Sprites[index][animation].leftOffset || 0;
        Sprites[index][animation].rightOffset = Sprites[index][animation].rightOffset || 0;
        Sprites[index][animation].topOffset = Sprites[index][animation].topOffset || 0;
        Sprites[index][animation].bottomOffset = Sprites[index][animation].bottomOffset || 0;
        Sprites[index][animation].xOffset = Sprites[index][animation].xOffset || 0;
        Sprites[index][animation].yOffset = Sprites[index][animation].yOffset || 0;
        Sprites[index][animation].verticalCount = Sprites[index][animation].verticalCount || 1;
        Sprites[index][animation].verticalIndex = Sprites[index][animation].verticalIndex || 0;
    }
}

module.exports = Sprites;
