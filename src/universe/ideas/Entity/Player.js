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
    this.categories.push('hasbrains');
    this.categories.push('player');

    /**
     * Client connection
     *
     * @property client
     * @type {Object}
     */
    this.client = false;

    /**
     * Label
     *
     * @property label
     * @type {String}
     */
    this.label = "Player";

    /**
     * Player view
     *
     * @property view
     * @type {Object}
     */
    this.view = false;

    /**
     * Attach client to player
     *
     * @method attachClient
     * @param {Object} client
     * @param {Function} callback
     */
    Player.prototype.attachClient = function (client, callback) {
        this.client = client;
        this.baseGoal = Goals.PlayerInput;

        var self = this;
        /**
         * Client disconnected
         *
         * @method ondisconnect
         */
        client.ondisconnect = function () {
            if (self.container)
                self.destroy();
        };

        /**
         * Client info recieved callback
         *
         * @method onclientinfo
         */
        client.oninfo = function () {
            self.updateView(true);
            this.trigger("viewUpdate", {width: self.view.width, height: self.view.height});
        };

        /**
         * Client ready to go
         *
         * @event ready
         */
        client.on("ready", function () {
            if (callback)
                callback();
        });

        /*
         * Update the client with needed info
         */
        this.inView = {0: {}};
        this.updateView(true);
        client.emit("attached", {
            assets: {
                sprites: Anslem.Sprites,
                sounds: {}
            },
            playerId: this.id,
            view: {
                width: self.view.width,
                height: self.view.height
            }
        });
    };

    /**
     * Generate packet of information required
     * to render the scene to send to client
     *
     * @method getPacket
     * @param {Boolean} isSource
     * @return {Object}
     */
    Player.prototype.getPacket = function (isSource) {
        if (isSource) {
            // Add extras for this player only
            if (!this.bubble && this.overActivatable) {
                this.bubble = {
                    message: "",
                    star: true,
                    time: 30
                };
                if (!this.changed) {
                    this.changed = true;
                    this.inViewChanged.push(this);
                }
            }

            // Generate packet
            var packet = {
                viewX: Math.floor(this.view.x),
                viewY: Math.floor(this.view.y),
                inViewAdded: [],
                inViewChanged: [],
                inViewRemoved: []
            };
            for (var index in this.inViewAdded) {
                packet.inViewAdded.push(this.inViewAdded[index].getPacket());
            }
            for (var index in this.inViewChanged) {
                packet.inViewChanged.push(this.inViewChanged[index].getPacket());
            }
            for (var index in this.inViewRemoved) {
                packet.inViewRemoved.push(this.inViewRemoved[index].getPacket());
            }
            return packet;
        }
        return Entity.prototype.getPacket.call(this);
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

        // Handle disconnect race
        if (!this.client || !this.container)
            return false;

        // Standing over activatable object
        this.overActivatable = this.instancePlace("activatable");

        // Maintain view
        this.updateView();

        // Bubble
        if (this.client.inputs.events.message) {
            this.bubble = {
                message: this.client.inputs.events.message,
                time: 180
            };
            if (!this.changed) {
                this.changed = true;
                this.inViewChanged.push(this);
            }
        }

        // Update client if needed
        if (this.changed || this.inViewAdded.length > 0 || this.inViewChanged.length > 0 || this.inViewRemoved.length > 0) {
            //console.log("[info] " + Date.now() + " client update with " + (this.inViewAdded.length + this.inViewChanged.length + this.inViewRemoved.length) + " objects.  " + this.inViewAdded.length + " added, " + this.inViewChanged.length + " changed, " + this.inViewRemoved.length + " removed");

            this.client.trigger("frameUpdate", this.getPacket(true));

//            var self = this;
//            setImmediate(function () {
//                self.client.trigger("frameUpdate", self.getPacket(true));
//            });
        }

        // Clear events
        this.client.inputs.events = {};
    };

    /**
     * Updates player view
     * TODO: Pretty this up
     *
     * @method updateView
     * @param {Boolean} updateSize update view size as well as position
     */
    Player.prototype.updateView = function (updateSize) {
        // Update size to handle window resizes
        if (updateSize) {
            var scale = ((1024 / this.client.info.screenWidth) / UniverseConfig.viewScale);
            var viewWidth = this.client.info.screenWidth * scale;
            var viewHeight = this.client.info.screenHeight * scale;
            this.view = {
                x: this.x - (viewWidth / 2),
                y: this.y - (viewHeight - this.height),
                xBuffer: viewWidth * UniverseConfig.viewXBuffer,
                yBuffer: viewHeight * UniverseConfig.viewYBuffer,
                scale: scale,
                speed: UniverseConfig.viewSpeed * scale,
                width: viewWidth,
                height: viewHeight
            };

            this.stats.perception = viewWidth > viewHeight ? viewWidth : viewHeight;
        }

        // Keep view near player if not in god node
        if (!this.stats.godmode) {
            if (this.x > this.view.x + this.view.width - this.view.xBuffer)
                this.view.x = this.x + this.view.xBuffer - this.view.width;
            else if (this.x < this.view.x + this.view.xBuffer)
                this.view.x = this.x - this.view.xBuffer;
            if (this.y > this.view.y + this.view.height - this.view.yBuffer)
                this.view.y = this.y + this.view.yBuffer - this.view.height;
            else if (this.y < this.view.y + this.view.yBuffer)
                this.view.y = this.y - this.view.yBuffer;
        }

        // Keep view with room boundries
        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.x + this.view.width > this.container.innerWidth)
            this.view.x = this.container.innerWidth - this.view.width;
        if (this.view.y > (this.container.innerHeight - this.view.height))
            this.view.y = this.container.innerHeight - this.view.height;
    };

    /**
     * Warp to given coords and maintain associative lists
     *
     * @method warp
     * @param {Number} targetX
     * @param {Number} targetY
     * @param {Idea} container
     */
    Player.prototype.warp = function (targetX, targetY, container) {
        if (this.client)
            this.client.trigger("transition", {class: "pt-page-moveToBottom", pauseRender: 600});
        Idea.prototype.warp.call(this, targetX, targetY, container);
        var self = this;
        setTimeout(function () {
            if (self.client) {
                self.client.trigger("transition", {class: "pt-page-moveFromBottom", pauseRender: 30});
                self.client.trigger("headline", {message: self.container.label});
            }
        }, 600);
    };

    /*
     * Player defaults
     */
    this.setSprite("goblin");
    this.stats.perception *= 4;
    this.stats.strength = 50;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Anslem.Player = Player;