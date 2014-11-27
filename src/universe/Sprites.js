/**
 * Sprites.js
 * List of available sprites and their info
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 *
 * @module Anslem.assets
 * @requires AnslemConfig, image-size
 */
var sizeOf = require('image-size');
var AnslemConfig = require('../AnslemConfig');

/**
 * Available sprites
 *
 * @class Sprites
 * @static
 */
var Sprites = {
    bgNight: {
        imagePath: '/sprites/bg-night/bg-night_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    bgClouds: {
        imagePath: '/sprites/bg-clouds/bg-clouds_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    bgMountains: {
        imagePath: '/sprites/bg-mountains/bg-mountains_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    bgMountainsMidground: {
        imagePath: '/sprites/bg-mountains-midground/bg-mountains-midground_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    bgTrees: {
        imagePath: '/sprites/bg-trees/bg-trees_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    bgGround: {
        imagePath: '/sprites/bg-ground/bg-ground_',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    sprMan: {
        imagePath: "/sprites/man-single/man-single_",
        frameCount: 6,
        frameSpeed: 0.5,
        singleImage: true
    },
    sprCoin: {
        imagePath: "/sprites/coin/coin_",
        frameCount: 1,
        frameSpeed: 0,
        singleImage: false
    },
    sprGoblin: {
        imagePath: "/sprites/goblin-walking/goblin-walking__",
        frameCount: 31,
        frameSpeed: 1,
        singleImage: false
    }
};

// Grab the size
for (var index in Sprites) {
    var dim = sizeOf(AnslemConfig.assetPath + Sprites[index].imagePath + "000.png");
    Sprites[index].width = dim.width;
    Sprites[index].height = dim.height;
}

module.exports = Sprites;
