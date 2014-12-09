var Actions = {};

var Goals = {};

var Idea = require('./Idea');

var Ideas = {};

var UniverseConfig = require('./UniverseConfig');

/**
 * Walk
 *
 * @module Anslem.Universe.Actions
 * @class Walk
 * @constructor
 * @param {Object} params direction to move, {dir: 1 || -1}
 */
function Walk(params) {
    this.description = "Walk";
    this.label = "Walk";
    this.params = params;
    this.progress = 0;
    this.speed = 1;
    Walk.prototype.run = function (params) {
        if (params.dir !== 0)
            this.facing = params.dir < 0 ? -1 : 1;
        if ((this.xSpeed < this.stats.speed && params.dir > 0) || (this.xSpeed > -this.stats.speed && params.dir < 0))
            this.xSpeed += (params.dir * this.stats.accel);
    };
    Walk.prototype.updateAnimation = function () {
        if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else {
            this.setAnimation("walk");
            if (this.animation === "walk")
                this.sprite.frameSpeed = this.sprite.src["walk"].frameSpeed * (Math.abs(this.xSpeed) / this.stats.speed);
        }
    };
}
Actions.Walk = Walk;

/**
 * Jump
 *
 * @module Anslem.Universe.Actions
 * @class Jump
 * @constructor
 */
function Jump() {
    this.description = "Jump";
    this.label = "Jump";
    this.params = false;
    this.progress = 0;
    this.speed = 5;
    Jump.prototype.run = function () {
        if (this.action.progress === 0 && this.ySpeed === 0)
            this.ySpeed -= this.stats.jump;
    };
    Jump.prototype.updateAnimation = function () {
        this.setAnimation("jump");
    };
}
Actions.Jump = Jump;

/**
 * Idle
 *
 * @module Anslem.Universe.Actions
 * @class Idle
 * @constructor
 */
function Idle() {
    this.description = "Idle";
    this.label = "Idle";
    this.params = false;
    this.progress = 0;
    this.speed = 1;
    Idle.prototype.run = function () {

    };
    Idle.prototype.updateAnimation = function () {
        if (this.stats.health <= 0)
            this.setAnimation("die");
        else if (this.ySpeed !== 0)
            this.setAnimation("jump");
        else if (this.xSpeed !== 0)
            this.setAnimation("walk");
        else if (this.stats.health < 50)
            this.setAnimation("tired");
        else
            this.setAnimation("default");
    };
}
Actions.Idle = Idle;

/**
 * Take a hit
 *
 * @module Anslem.Universe.Actions
 * @class Flinch
 * @constructor
 * @param {Object} params {dir: 1 || -1, strength: 5}
 */
function Flinch(params) {
    this.description = "Take a hit";
    this.label = "Flinch";
    this.params = params;
    this.progress = 0;
    this.speed = 20;
    Flinch.prototype.run = function (params) {
        if (this.action.progress === 0) {
            this.xSpeed += (params.strength * params.dir);
            this.ySpeed -= (params.strength * 0.5);
            this.stats.health -= params.strength;
        }
    };
    Flinch.prototype.updateAnimation = function () {
        this.setAnimation("flinch");
    };
}
Actions.Flinch = Flinch;

/**
 * Die
 *
 * @module Anslem.Universe.Actions
 * @class Die
 * @constructor
 */
function Die() {
    this.description = "Die";
    this.label = "Die";
    this.params = false;
    this.progress = 0;
    this.speed = 20;
    Die.prototype.run = function () {
        if (this.action.progress === 0) {
            this.alive = false;
            this.removeCategory('aware');
            this.removeCategory('physical');
        }
    };
    Die.prototype.updateAnimation = function () {
        this.setAnimation("die");
    };
}
Actions.Die = Die;

/**
 * Attack with whatever I am holding
 *
 * @module Anslem.Universe.Actions
 * @class Attack
 * @constructor
 * @param {Object} params {dir: 1 || -1, target: {Idea}}
 */
function Attack(params) {
    this.description = "Attack";
    this.label = "Attack";
    this.params = params;
    this.progress = 0;
    this.speed = 12;
    Attack.prototype.run = function (params) {
        this.facing = params.dir;

        var hit = params.target ? (this.collides(params.target.bbox()) ? params.target : false) : this.instancePlace("physical", this.x + ((this.width / 2) * params.dir), this.y);
        if (hit && hit.immunityTimeout === 0) {
            hit.action = new Actions.Flinch({dir: params.dir, strength: this.stats.strength});
            hit.immunityTimeout = this.action.speed;
        }
    };
    Attack.prototype.updateAnimation = function () {
        this.setAnimation("attack");
        if (this.sprite.animation === "attack")
            this.sprite.frameSpeed = this.sprite.src["attack"].frameCount / this.action.speed;
    };
}
Actions.Attack = Attack;

/**
 * Action template
 *
 * @module Anslem.Universe.Actions
 * @class ActionTemplate
 * @constructor
 * @param {Object} params optional params for action
 */
function ActionTemplate(params) {
    /**
     * Basic description
     *
     * @property description
     * @type {String}
     */
    this.description = "Action template description";

    /**
     * Basic label or name
     *
     * @property label
     * @type {String}
     */
    this.label = "Action Template";

    /**
     * Parameters for the action, defined per action basis
     *
     * @property params
     * @type {Object}
     */
    this.params = params || {};

    /**
     * How far the action has progressed so far in frames
     *
     * @property progress
     * @type {Number}
     */
    this.progress = 0;

    /**
     * How many frames it takes to do one complete action
     *
     * @property speed
     * @type {String}
     */
    this.speed = 0;

    /**
     * Sets animation. This method gets called in the context of the calling entity
     *
     * @method updateAnimation
     */
    ActionTemplate.prototype.updateAnimation = function () {
        // Determine animation here...
        this.setAnimation("default");
    };

    /**
     * Run the action. This method gets called in the context of the calling entity
     *
     * @method run
     * @param {Object} params action parameters defined at creation
     */
    ActionTemplate.prototype.run = function (params) {
        // Do whatever needs to be done
    };
}
Actions.ActionTemplate = ActionTemplate;

/**
 * PlayerInput
 *
 * @module Anslem.Universe.Goals
 * @class PlayerInput
 * @static
 */
Goals.PlayerInput = {
    description: "PlayerInput",
    label: "Player Goal",
    getAction: function () {
        if (this.stats.lookmode) {
            // Desktop
            if (this.inputs.events.keyup && this.inputs.events.keyup.V) {
                this.stats.lookmode = false;
            } else if (this.inputs.keyboard.D) {
                this.view.x += (this.view.speed * 2);
            } else if (this.inputs.keyboard.A) {
                this.view.x -= (this.view.speed * 2);
            }
            if (this.inputs.keyboard.S) {
                this.view.y += (this.view.speed * 2);
            } else if (this.inputs.keyboard.W) {
                this.view.y -= (this.view.speed * 2);
            }

            // Mobile
            if (this.inputs.events.swipeup) {
                this.stats.lookmode = false;
            } else if (this.inputs.touches.length === 1) {
                var touch = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                if (touch.x > touch.startX) {
                    this.view.x += (this.view.speed * 2);
                } else if (touch.x < touch.startX) {
                    this.view.x -= (this.view.speed * 2);
                }
                if (touch.y > touch.startY) {
                    this.view.y += (this.view.speed * 2);
                } else if (touch.y < touch.startY) {
                    this.view.y -= (this.view.speed * 2);
                }
            } else if (this.inputs.touches.length === 2 && this.inputs.events.touchmove) {
                var touch0 = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                var touch1 = this.inputs.touches[Object.keys(this.inputs.touches)[1]];
                var touchDist0 = touch0.x - touch0.startX;
                var touchDist1 = touch1.x - touch1.startX;
                if (Math.abs(touchDist0) > 5 && Math.abs(touchDist1) > 5) {
                    var pinchDistStart = Math.sqrt(Math.pow(touch0.startX - touch1.startX, 2) + Math.pow(touch0.startY - touch1.startY, 2));
                    var pinchDistEnd = Math.sqrt(Math.pow(touch0.x - touch1.x, 2) + Math.pow(touch0.y - touch1.y, 2));
                    var pinchDistance = pinchDistStart - pinchDistEnd;
                    this.view.scale += (pinchDistance / this.view.width);
                    this.view.scale = Math.floor(this.view.scale * 10000) / 10000;
                    if (this.view.scale < 0.1)
                        this.view.scale = 0.1;
                    else if (this.view.scale > 4)
                        this.view.scale = 4;
                    this.initializeView(this.view.scale);
                    this.client.sendViewUpdate(this.view);
                }
            }
        } else {
            // Desktop
            if (this.inputs.events.keyup && this.inputs.events.keyup.V) {
                this.stats.lookmode = true;
            } else if (this.inputs.events.keydown) {
                if (this.inputs.events.keydown.F) {
                    return new Actions.Attack({dir: this.facing});
                } else if (this.inputs.events.keydown.W) {
                    return new Actions.Jump();
                }
            } else if (this.inputs.keyboard.A) {
                return new Actions.Walk({dir: -1});
            } else if (this.inputs.keyboard.D) {
                return new Actions.Walk({dir: 1});
            }

            // Mobile
            if (this.inputs.touches.length === 4) {
                this.stats.lookmode = true;
            } else if (this.inputs.events.swipeup) {
                return new Actions.Jump();
            } else if (this.inputs.events.swiperight) {
                return new Actions.Attack({dir: 1});
            } else if (this.inputs.events.swipeleft) {
                return new Actions.Attack({dir: -1});
            } else if (this.inputs.touches.length === 1) {
                var touch = this.inputs.touches[Object.keys(this.inputs.touches)[0]];
                var dist = Math.min(Math.abs(touch.x - touch.startX), 100);
                if (touch.x > touch.startX) {
                    return new Actions.Walk({dir: dist / 100});
                } else if (touch.x < touch.startX) {
                    return new Actions.Walk({dir: -dist / 100});
                }
            }
        }
        // Idle
        return new Actions.Idle();
    }
};

/**
 * Kill target
 *
 * @module Anslem.Universe.Goals
 * @class Kill
 * @static
 */
Goals.Kill = {
    description: "Kill target",
    label: "Kill",
    getAction: function (params) {
        var dist = this.distanceTo(params.x, params.y);
        if (dist < this.width)
            return new Actions.Attack({dir: params.x > this.x ? 1 : -1, target: params});
        return Goals.Goto.getAction.call(this, params);
    }
};

/**
 * Go to
 *
 * @module Anslem.Universe.Goals
 * @class Goto
 * @static
 */
Goals.Goto = {
    description: "Go to target",
    label: "Go to",
    getAction: function (params) {
        return new Actions.Walk({dir: params.x > this.x ? 1 : -1});
    }
};

/**
 * Eat Brains
 *
 * @module Anslem.Universe.Goals
 * @class EatBrains
 * @static
 */
Goals.EatBrains = {
    description: "Eat brains",
    label: "Eat brains",
    getAction: function () {
        var nearest = this.instanceNearest("aware");
        if (nearest) {
            var dist = this.distanceTo(nearest.x, nearest.y);
            if (nearest.baseGoal !== Goals.Dead && dist < this.stats.perception)
                return Goals.Kill.getAction.call(this, nearest);
        }
        if (!this.stats.focus || (this.distanceTo(this.stats.focus.x, this.y) < this.width)) {
            this.stats.focus = {x: Math.random() * this.container.width, y: this.y};
        }

        return Goals.Goto.getAction.call(this, this.stats.focus);
    }
};

/**
 * Dead
 *
 * @module Anslem.Universe.Goals
 * @class Dead
 * @static
 */
Goals.Dead = {
    description: "Dead",
    label: "Dead",
    getAction: function () {
        if (this.alive) {
            this.stats.timeOfDeath = (new Date()).getTime();
            return new Actions.Die();
        }

        // Respawn for testing
        if (this.inputs && ((this.inputs.events.keydown && this.inputs.events.keydown.R) || this.inputs.events.swipeup)) {
            this.stats.health = 100;
            this.baseGoal = Goals.PlayerInput;
            this.addCategory('physical');
            if (this.sprite.name === "goblin") {
                this.addCategory('aware');
                this.setSprite("warrior");
            } else {
                this.stats.jump = 0;
                this.stats.speed = 10;
                this.setSprite("skeleton");
            }
            this.alive = true;
        }
        if (!this.inputs && ((new Date()).getTime() > (this.stats.timeOfDeath + 60000))) {
            this.stats.health = 100;
            this.baseGoal = Goals.EatBrains;
            this.addCategory('physical');
            this.alive = true;
        }
        return new Actions.Idle();
    }
};

/**
 * Region
 *
 * @module Anslem.Universe
 */

/**
 * Region
 *
 * @class Region
 * @constructor
 * @extends Idea
 */
function Region() {
    Idea.call(this);
    /**
     * Obstruction buffer, for grounds and ceilings
     *
     * @property buffer
     * @type {Object}
     */
    this.buffer = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('region');

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 2048 * UniverseConfig.scaleFactor;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 30000 * UniverseConfig.scaleFactor;
}
Region.prototype = new Idea();
Region.prototype.constructor = Region;

module.exports = Region;

/**
 * Entity
 *
 * @module Anslem.Universe
 */

/**
 * Entity
 *
 * @class Entity
 * @constructor
 * @extends Idea
 */
function Entity() {
    Idea.call(this);
    /**
     * Current action
     *
     * @property action
     * @type {Action}
     */
    this.action = false;

    /**
     * Conscious
     *
     * @property alive
     * @type {Boolean}
     */
    this.alive = true;

    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = Goals.EatBrains;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('physical');
    this.categories.push('entity');
    this.categories.push('aware');

    /**
     * Current goal
     *
     * @property goal
     * @type {Goal}
     */
    this.goal = false;

    /**
     * Falling speed
     *
     * @property gravity
     * @type {Number}
     */
    this.gravity = UniverseConfig.gravity;

    /**
     * Memories
     *
     * @property memory
     * @type {Array}
     */
    this.memory = [];

    /**
     * Stats
     *
     * @property
     * @type {Object}
     */
    this.stats = Object.create(UniverseConfig.defaultEntityStats);

    /**
     * Entities default to higher depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 100;

    /**
     * Runs single frame
     *
     * @method run
     */
    Entity.prototype.run = function () {
        Idea.prototype.run.call(this);

        this.inView = [];
        if (this.container) {
            for (var id in this.container.contents[0]) {
                var idea = this.container.contents[0][id];
                if (idea.hasCategory('landscape') || this.distanceTo(idea.x, idea.y) < this.stats.perception) {
                    this.inView.push(idea);
                }
            }
        }

        if (this.stats.health <= 0) {
            this.baseGoal = Goals.Dead;
            this.action = false;
        }
        if (!this.action || this.action.progress >= this.action.speed)
            this.action = this.baseGoal.getAction.call(this);
        if (this.action) {
            this.action.updateAnimation.call(this);
            this.action.run.call(this, this.action.params);
            this.action.progress++;
        }
    };
}
Entity.prototype = new Idea();
Entity.prototype.constructor = Entity;

module.exports = Entity;


/**
 * Player
 *
 * @module Anslem.Universe
 */

/**
 * Player
 *
 * @class Player
 * @constructor
 * @extends Entity
 */
function Player() {
    Entity.call(this);
    /**
     * Basic driving goal
     *
     * @property baseGoal
     * @type {Goal}
     */
    this.baseGoal = Goals.PlayerInput;

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('player');

    /**
     * Client connection
     *
     * @property client
     * @type {Object}
     */
    this.client = false;

    /**
     * Player view
     *
     * @property view
     * @type {Object}
     */
    this.view = false;

    /**
     * Generate packet of information required
     * to render the scene to send to client
     *
     * @method getPacket
     * @param {Boolean} includeInView
     * @return {Object}
     */
    Player.prototype.getPacket = function (includeInView) {
        var packet = Idea.prototype.getPacket.call(this);
        if (includeInView) {
            packet.viewX = this.view.x;
            packet.viewY = this.view.y;
            packet.inView = {};
            for (var index in this.inView) {
                packet.inView[this.inView[index].id] = this.inView[index].getPacket();
            }
        }
        return packet;
    };

    /**
     * Initialize player view
     *
     * @method initializeView
     * @param {Number} scale
     */
    Player.prototype.initializeView = function (scale) {
        scale = scale || UniverseConfig.viewScale;
        var viewWidth = this.client.info.screenWidth * scale;
        var viewHeight = this.client.info.screenHeight * scale;

        this.view = {
            x: this.x - (viewWidth / 2),
            y: this.y - (viewHeight / 2),
            xBuffer: UniverseConfig.viewXBuffer,
            yBuffer: UniverseConfig.viewYBuffer,
            scale: scale,
            speed: UniverseConfig.viewSpeed * scale,
            width: viewWidth,
            height: viewHeight
        };
    };

    /**
     * Load
     *
     * @method load
     * @param {Object} client
     * @param {Idea} universe
     */
    Player.prototype.load = function (client, universe) {
        this.setSprite("goblin");
        this.stats.perception *= 4;
        this.warp(200, universe.height - (this.height / 2), universe);
        this.inputs = client.inputs;
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

        // Clear events
        this.inputs.events = {};

        // Bubble
        if (this.inputs.message) {
            this.bubble = {
                message: this.inputs.message,
                time: 60
            };
            this.inputs.message = false;
        }

        // Maintain view
        if (this.x > this.view.x + this.view.width - this.view.xBuffer)
            this.view.x = this.x + this.view.xBuffer - this.view.width;
        else if (this.x < this.view.x + this.view.xBuffer)
            this.view.x = this.x - this.view.xBuffer;
        if (this.y > this.view.y + this.view.height - this.view.yBuffer)
            this.view.y = this.y + this.view.yBuffer - this.view.height;
        else if (this.y < this.view.y + this.view.yBuffer)
            this.view.y = this.y - this.view.yBuffer;

        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.x + this.view.width > this.container.width)
            this.view.x = this.container.width - this.view.width;
        if (this.view.y > (this.container.height - this.view.height))
            this.view.y = this.container.height - this.view.height;
    };
}
Player.prototype = new Entity();
Player.prototype.constructor = Entity;

module.exports = Player;


/**
 * Universe
 *
 * @module Anslem.Universe
 */

/**
 * Universe
 *
 * @class Universe
 * @constructor
 * @extends Idea
 */
function Universe() {
    Region.call(this);
    /**
     * Obstruction buffer, for grounds and ceilings
     *
     * @property buffer
     * @type {Object}
     */
    this.buffer = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    };

    /**
     * Categories
     *
     * @property categories
     * @type {Array}
     */
    this.categories.push('universe');

    /**
     * Size in y dimension
     *
     * @property height
     * @type {Number}
     */
    this.height = 2048 * UniverseConfig.scaleFactor;

    /**
     * Size in x dimension
     *
     * @property width
     * @type {Number}
     */
    this.width = 30000 * UniverseConfig.scaleFactor;

    /**
     * Populate the universe
     *
     * @method populate
     */
    Universe.prototype.populate = function () {
        var l1 = new Idea(['landscape']);
        l1.setSprite("bgMountains", true, false, 0.4);
        l1.z = 1;
        l1.warp(0, this.height - (l1.height / 2) - (Sprites["bgGround"]["default"].height / 2), this);

        this.ground = new Idea(['landscape']);
        this.ground.setSprite("bgGround", true, false, 1);
        this.ground.z = 10;
        this.ground.warp(0, this.height - (this.ground.height / 2), this);
        this.buffer.bottom = this.ground.height - 16;

        for (var n = 0; n < 15; n++) {
            var i = new Entity();
            i.setSprite("skeleton");
            i.removeCategory('aware');
            i.stats.speed *= 0.5;
            i.warp(1000 + (Math.random() * (this.width - 1000)), 400, this);
        }
    };
    this.populate();
}
Universe.prototype = new Region();
Universe.prototype.constructor = Universe;

module.exports = Universe;

module.exports = Ideas;