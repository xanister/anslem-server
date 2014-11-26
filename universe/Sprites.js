/**
 * Sprites.js
 * List of available sprites and their info
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 */

/**
 * Includes
 */
var sizeOf = require('image-size');

var Sprites = {
    bgNight: {
        imagePath: 'assets/sprites/bg-night/bg-night_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    bgClouds: {
        imagePath: 'assets/sprites/bg-clouds/bg-clouds_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    bgMountains: {
        imagePath: 'assets/sprites/bg-mountains/bg-mountains_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    bgMountainsMidground: {
        imagePath: 'assets/sprites/bg-mountains-midground/bg-mountains-midground_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    bgTrees: {
        imagePath: 'assets/sprites/bg-trees/bg-trees_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    bgGround: {
        imagePath: 'assets/sprites/bg-ground/bg-ground_',
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    sprMan: {
        imagePath: "assets/sprites/man-single/man-single_",
        frameCount: 6,
        frameSpeed: 0.5,
        scale: 1,
        singleImage: true
    },
    sprCoin: {
        imagePath: "assets/sprites/coin/coin_",
        frameCount: 1,
        frameSpeed: 0,
        scale: 1,
        singleImage: false
    },
    sprGoblin: {
        imagePath: "assets/sprites/goblin-walking/goblin-walking__",
        frameCount: 32,
        frameSpeed: 0.5,
        scale: 1,
        singleImage: false
    }
};

// Grab the size
for (var index in Sprites) {
    var dim = sizeOf('./../' + Sprites[index].imagePath + "000.png");
    Sprites[index].width = dim.width;
    Sprites[index].height = dim.height;
}

module.exports = Sprites;