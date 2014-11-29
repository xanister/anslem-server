/**
 * List of available sprites and their info
 *
 * @module Anslem.assets
 * @requires AnslemServerConfig, image-size
 */
var AnslemServerConfig = require('../AnslemServerConfig');
var sizeOf = require('image-size');

/**
 * Available sprites
 *
 * @class Sprites
 * @static
 */
var Sprites = {
    bgNight: {
        imagePath: '/sprites/bg-night/bg-night',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    bgClouds: {
        imagePath: '/sprites/bg-clouds/bg-clouds',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    bgMountains: {
        imagePath: '/sprites/bg-mountains/bg-mountains',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    bgMountainsMidground: {
        imagePath: '/sprites/bg-mountains-midground/bg-mountains-midground',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    bgTrees: {
        imagePath: '/sprites/bg-trees/bg-trees',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    bgGround: {
        imagePath: '/sprites/bg-ground/bg-ground',
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    sprCoin: {
        imagePath: "/sprites/coin/coin",
        frameCount: 1,
        frameSpeed: 0,
        singleImage: true
    },
    sprGoblinIdle: {
        imagePath: "/sprites/goblin/idle/goblin-idle",
        frameCount: 24,
        frameSpeed: 0.5,
        singleImage: true
    },
    sprGoblinJump: {
        imagePath: "/sprites/goblin/jump/goblin-jump",
        frameCount: 9,
        frameSpeed: 0.5,
        singleImage: true
    },
    sprGoblinWalk: {
        imagePath: "/sprites/goblin/walk/goblin-walk",
        frameCount: 32,
        frameSpeed: 1,
        singleImage: true
    }
};

// Grab the size
for (var index in Sprites) {
    var dim = sizeOf(AnslemServerConfig.assetPath + Sprites[index].imagePath + (Sprites[index].singleImage ? "" : "__000") + ".png");
    Sprites[index].width = Sprites[index].singleImage ? dim.width / Sprites[index].frameCount : dim.width;
    Sprites[index].height = dim.height;
}

module.exports = Sprites;
