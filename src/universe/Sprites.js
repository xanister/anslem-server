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
            loop: true,
            singleImage: true
        }
    },
    bgClouds: {
        default: {
            imagePath: '/sprites/bg-clouds/bg-clouds',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
        }
    },
    bgMountains: {
        default: {
            imagePath: '/sprites/bg-mountains/bg-mountains',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
        }
    },
    bgMountainsMidground: {
        default: {
            imagePath: '/sprites/bg-mountains-midground/bg-mountains-midground',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
        }
    },
    bgTrees: {
        default: {
            imagePath: '/sprites/bg-trees/bg-trees',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
        }
    },
    bgGround: {
        default: {
            imagePath: '/sprites/bg-ground/bg-ground',
            frameCount: 1,
            frameSpeed: 0,
            loop: true,
            singleImage: true
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
    },
    goblin: {
        default: {
            imagePath: "/sprites/goblin/idle/goblin-idle",
            frameCount: 24,
            frameSpeed: 0.5,
            loop: true,
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
        die: {
            imagePath: "/sprites/skeleton/die/skeleton-die",
            frameCount: 20,
            frameSpeed: 1,
            loop: false,
            singleImage: true,
            yOffset: 10
        },
        flinch: {
            imagePath: "/sprites/goblin/flinch/goblin-flinch",
            frameCount: 12,
            frameSpeed: 0.25,
            loop: true,
            singleImage: true,
            xOffset: 35,
            yOffset: -30
        },
        jump: {
            imagePath: "/sprites/goblin/jump/goblin-jump",
            frameCount: 9,
            frameSpeed: 0.5,
            loop: true,
            singleImage: true
        },
        tired: {
            imagePath: "/sprites/goblin/tired/goblin-tired",
            frameCount: 32,
            frameSpeed: 1,
            loop: true,
            singleImage: true
        },
        walk: {
            imagePath: "/sprites/goblin/walk/goblin-walk",
            frameCount: 32,
            frameSpeed: 1,
            loop: true,
            singleImage: true
        }
    },
    skeleton: {
        default: {
            imagePath: "/sprites/skeleton/idle/skeleton-idle",
            frameCount: 32,
            frameSpeed: 1,
            loop: true,
            singleImage: true
        },
        attack: {
            imagePath: "/sprites/skeleton/attack/skeleton-attack",
            frameCount: 16,
            frameSpeed: 1,
            loop: false,
            singleImage: true,
            xOffset: 0,
            yOffset: 20
        },
        die: {
            imagePath: "/sprites/skeleton/die/skeleton-die",
            frameCount: 20,
            frameSpeed: 1,
            loop: false,
            singleImage: true,
            yOffset: 10
        },
        flinch: {
            imagePath: "/sprites/skeleton/flinch/skeleton-flinch",
            frameCount: 11,
            frameSpeed: 0.25,
            loop: true,
            singleImage: true,
            xOffset: 0,
            yOffset: 0
        },
        walk: {
            imagePath: "/sprites/skeleton/walk/skeleton-walk",
            frameCount: 32,
            frameSpeed: 1,
            loop: true,
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
        Sprites[index][animation].xOffset = Sprites[index][animation].xOffset || 0;
        Sprites[index][animation].yOffset = Sprites[index][animation].yOffset || 0;
    }
}

module.exports = Sprites;
