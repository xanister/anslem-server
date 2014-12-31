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
     * Split packets into chunks
     *
     * @property packetIndex
     * @type {Number}
     */
    var packetIndex = 0;

    /**
     * Number of chunks
     *
     * @property packetSplit
     * @type {Number}
     */
    var packetSplit = 2;

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
     */
    Player.prototype.attachClient = function (client) {
        this.client = client;
        this.baseGoal = Goals.PlayerInput;

        var self = this;
        /**
         * Client disconnected
         *
         * @method ondisconnect
         */
        client.ondisconnect = function () {
            //TODO
        };

        /**
         * Client info recieved callback
         *
         * @method onclientinfo
         */
        client.oninfo = function () {
            self.initializeView();
            this.trigger("viewUpdate", {width: self.view.width, height: self.view.height});
        };

        client.oninput = function () {
            if (this.inputs.events.message)
                console.log(this.inputs.events.message);
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
                case "ready":
                    break;
            }
        };

        /*
         * Update the client with needed info
         */
        client.emit("attached", this.id);
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
            var packet = {
                viewX: this.view.x,
                viewY: this.view.y,
                inView: {}
            };
            var index = 1;
            for (var id in this.inView[0]) {
                if (index++ % packetSplit === packetIndex)
                    packet.inView[id] = this.inView[0][id].getPacket();
            }
            if (++packetIndex > packetSplit)
                packetIndex = 0;
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
        var scale = this.client.info.screenWidth < 768 ? UniverseConfig.viewScale * 2 : UniverseConfig.viewScale;
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

        // Add extra in view
        for (var id in this.container.contents.landscape)
            this.inView[0][id] = this.container.contents.landscape[id];

        // Standing over activatable object
        this.overActivatable = this.instancePlace("activatable");

        // Bubble
        if (!this.bubble) {
            if (this.client.inputs.events.message) {
                this.bubble = {
                    message: this.client.inputs.events.message,
                    time: 180
                };
            } else if (this.overActivatable) {
                this.bubble = {
                    message: "",
                    star: true,
                    time: 5
                };
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

        this.client.trigger("frameUpdate", this.getPacket(true));

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

        if (this.client) {
            this.client.trigger("transition", {start: "pt-page-moveToBottom", end: "pt-page-moveFromBottom", duration: 1000});
            this.initializeView();
        }
    };

    /*
     * Player defaults
     */
    this.setSprite("xanister");
    this.stats.perception *= 4;
    this.stats.strength = 50;
}
Player.prototype = new Entity();
Player.prototype.constructor = Player;

Anslem.Player = Player;