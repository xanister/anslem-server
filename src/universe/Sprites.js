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
        default: {
            imagePath: '/sprites/bg-night/bg-night',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    bgClouds: {
        default: {
            imagePath: '/sprites/bg-clouds/bg-clouds',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    bgMountains: {
        default: {
            imagePath: '/sprites/bg-mountains/bg-mountains',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    bgMountainsMidground: {
        default: {
            imagePath: '/sprites/bg-mountains-midground/bg-mountains-midground',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    bgTrees: {
        default: {
            imagePath: '/sprites/bg-trees/bg-trees',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    bgGround: {
        default: {
            imagePath: '/sprites/bg-ground/bg-ground',
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    coin: {
        default: {
            imagePath: "/sprites/coin/coin",
            frameCount: 1,
            frameSpeed: 0,
            singleImage: true
        }
    },
    goblin: {
        default: {
            imagePath: "/sprites/goblin/idle/goblin-idle",
            frameCount: 24,
            frameSpeed: 0.5,
            singleImage: true
        },
        attack: {
            imagePath: "/sprites/goblin/attack/goblin-attack",
            frameCount: 20,
            frameSpeed: 1,
            loop: false,
            singleImage: true,
            xOffset: 35,
            yOffset: -30
        },
        flinch: {
            imagePath: "/sprites/goblin/flinch/goblin-flinch",
            frameCount: 12,
            frameSpeed: 0.25,
            singleImage: true,
            xOffset: 35,
            yOffset: -30
        },
        jump: {
            imagePath: "/sprites/goblin/jump/goblin-jump",
            frameCount: 9,
            frameSpeed: 0.5,
            singleImage: true
        },
        tired: {
            imagePath: "/sprites/goblin/tired/goblin-tired",
            frameCount: 32,
            frameSpeed: 1,
            singleImage: true
        },
        walk: {
            imagePath: "/sprites/goblin/walk/goblin-walk",
            frameCount: 32,
            frameSpeed: 1,
            singleImage: true
        }
    }
};

// Setup initial sprite info
for (var index in Sprites) {
    for (var animation in Sprites[index]) {
        var dim = sizeOf(AnslemServerConfig.assetPath + Sprites[index][animation].imagePath + (Sprites[index][animation].singleImage ? "" : "__000") + ".png");
        Sprites[index][animation].width = Sprites[index][animation].singleImage ? dim.width / Sprites[index][animation].frameCount : dim.width;
        Sprites[index][animation].height = dim.height;
        Sprites[index][animation].loop = Sprites[index][animation].loop || true;
        Sprites[index][animation].xOffset = Sprites[index][animation].xOffset || 0;
        Sprites[index][animation].yOffset = Sprites[index][animation].yOffset || 0;
    }
}

module.exports = Sprites;
