/**
 * List of available sprites and their info
 *
 * @module Anslem.assets
 * @requires AnslemServerConfig, fs, image-size
 */
var AnslemServerConfig = require('../app/AnslemServerConfig');
var fs = require('fs');
var sizeOf = require('image-size');

/**
 * Available sprites
 *
 * @class Sprites
 * @static
 */
var Sprites = {
    bgClouds: {
        default: {
            imagePath: '/sprites/bg-clouds/bg-clouds',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgForest: {
        default: {
            imagePath: '/sprites/bg-forest/bg-forest',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgForestMidground: {
        default: {
            imagePath: '/sprites/bg-forest-midground/bg-forest-midground',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgGround: {
        default: {
            imagePath: '/sprites/bg-ground/bg-ground',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgGroundGrass: {
        default: {
            imagePath: '/sprites/bg-ground-grass/bg-ground-grass',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgMountains: {
        default: {
            imagePath: '/sprites/bg-mountains/bg-mountains',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgMountainsMidground: {
        default: {
            imagePath: '/sprites/bg-mountains-midground/bg-mountains-midground',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgNight: {
        default: {
            imagePath: '/sprites/bg-night/bg-night',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    bgTrees: {
        default: {
            imagePath: '/sprites/bg-trees/bg-trees',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true,
            tileX: true
        }
    },
    coin: {
        default: {
            imagePath: "/sprites/coin/coin",
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
        }
    }
};

// Load additional sprites from json definition files
fs.readdirSync(__dirname + '/sprites').forEach(function (file) {
    var spriteJson = fs.readFileSync(__dirname + '/sprites/' + file);
    try {
        var sprite = JSON.parse(spriteJson);
        Sprites[sprite.name] = sprite.animations;
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
