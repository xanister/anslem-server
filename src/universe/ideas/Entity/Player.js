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
        console.log("attaching client to " + this.slug);
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
            self.initializeView();
            this.trigger("transition", {start: "pt-page-moveToBottom", end: "pt-page-moveFromBottom", duration: 1000});
            this.trigger("viewUpdate", {width: self.view.width, height: self.view.height});
        };

        /**
         * Client state changed update
         *
         * @event onstatechange
         * @param {String} state
         */
        client.onstatechange = function (state) {
            switch (state) {
                case "paused":
                    break;
                case "running":
                    if (!self.container && callback)
                        callback();
                    else {
                        self.changed = true;
                        self.updateInView();
                        self.client.trigger("frameUpdate", self.getPacket(true));
                    }
                    break;
            }
        };

        /*
         * Update the client with needed info
         */
        client.emit("attached", this.id);
        self.inView = {0: {}};
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
                    time: 10
                };
                if (!this.changed) {
                    this.changed = true;
                    this.inViewChanged.push(this);
                }
            }

            // Generate packet
            var packet = {
                viewX: this.view.x,
                viewY: this.view.y,
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
     * Initialize player view
     * TODO: Organize
     *
     * @method initializeView
     */
    Player.prototype.initializeView = function () {
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
    };

    /**
     * Runs single frame
     *
     * @method run
     */
    Player.prototype.run = function () {
        Entity.prototype.run.call(this);

        if (!this.client || !this.container)
            return false;

        // Debugging
        if (this.client.inputs.keyboard.K) {
            console.log(this.baseGoal.label);
        }

        // Standing over activatable object
        this.overActivatable = this.instancePlace("activatable");

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

        // Maintain view
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
        if (this.view.x < 0)
            this.view.x = 0;
        if (this.view.x + this.view.width > this.container.innerWidth)
            this.view.x = this.container.innerWidth - this.view.width;
        if (this.view.y > (this.container.innerHeight - this.view.height))
            this.view.y = this.container.innerHeight - this.view.height;

        // Update client if needed
        if (this.changed || this.inViewAdded.length > 0 || this.inViewChanged.length > 0 || this.inViewRemoved.length > 0) {
            console.log(Date.now() + " client update with " + (this.inViewAdded.length + this.inViewChanged.length + this.inViewRemoved.length) + " objects.  " + this.inViewAdded.length + " added, " + this.inViewChanged.length + " changed, " + this.inViewRemoved.length + " removed");
            this.client.trigger("frameUpdate", this.getPacket(true));
        }

        // Clear events
        this.client.inputs.events = {};
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
        Idea.prototype.warp.call(this, targetX, targetY, container);
        this.view.x = -10000;
        this.view.y = -10000;
        this.updateInView();
        if (this.client) {
            this.client.trigger("frameUpdate", this.getPacket(true));
            this.client.trigger("transition", {start: "pt-page-moveToBottom", end: "pt-page-moveFromBottom", duration: 1000});
            this.initializeView();
        }
    };

    /*
     * Player defaults
     */
    this.setSprite("justin");
    this.stats.perception *= 4;
    this.stats.strength = 50;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Anslem.Player = Player;