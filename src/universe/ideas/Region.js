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
    this.categories.push('activatable');
    this.categories.push('visible');

    /**
     * Label
     *
     * @property label
     * @type {String}
     */
    this.label = "Region";

    /**
     * Depth
     *
     * @property z
     * @type {Number}
     */
    this.z = 150;

    /**
     * Activate region from outside
     * this.innerHeight - this.buffer.bottom - (src.height / 2) = Ground height. Warp
     * player to ground height
     *
     * @method activate
     * @param {Idea} src calling entity
     */
    Region.prototype.activate = function (src) {
        src.warp(src.width, this.innerHeight - this.buffer.bottom - (src.height / 2), this);
    };

    /**
     * Return savable object
     *
     * @method fromSimple
     * @param {Object} src
     */
    Region.prototype.fromSimple = function (src) {
        Idea.prototype.fromSimple.call(this, src);
        this.buffer = src.buffer;
        this.portOffset = src.portOffset;
        return this;
    };

    /**
     * Initialize the region
     *
     * @method init
     * @param {String} slug
     */
    Region.prototype.init = function (slug) {
        /**
         * Slug
         *
         * @property regionSlug
         * @type {Sting}
         */
        this.slug = slug || "region-" + this.id;

        /**
         * Size in y dimension
         *
         * @property height
         * @type {Number}
         */
        this.innerHeight = Regions[this.slug].innerHeight * UniverseConfig.scaleFactor;

        /**
         * Size in x dimension
         *
         * @property width
         * @type {Number}
         */
        this.innerWidth = Regions[this.slug].innerWidth * UniverseConfig.scaleFactor;

        /**
         * Port offset from base
         *
         * @property portOffset
         * @type {Number}
         */
        this.portOffset = Regions[this.slug].portOffset;

        /*
         * Set container
         */
        this.container = Regions[Regions[this.slug].container];

        /*
         * Initialize position
         */
        this.x = Regions[this.slug].x || 500;
        this.y = Regions[this.slug].y || (Regions[this.slug].innerHeight - (this.height / 2));
    };

    /**
     * Populate the region. Only call if region is
     * running in same region server as parent
     *
     * @method populate
     */
    Region.prototype.populate = function () {
        for (var index in Regions[this.slug].contents) {
            // Create it
            var s = Regions[this.slug].contents[index];
            var newRegion = new Anslem[Regions[s].type]();
            newRegion.init(s);

            // Start it
            if (newRegion.portOffset !== newRegion.container.portOffset) {
                console.log("[info] starting child region " + newRegion.slug);
                exec("screen -d -m node server.js " + newRegion.slug);
            } else {
                console.log("[info] populating " + newRegion.slug);
                newRegion.populate();
            }

            // Add it
            newRegion.warp(Regions[s].x || 500, Regions[s].y || (this.innerHeight - this.buffer.bottom - (newRegion.height / 2)), this);
        }
    };

    /**
     * Run the region and all contents
     *
     * @method run
     */
    Region.prototype.run = function () {
        Idea.prototype.run.call(this);

        for (var id in this.contents[0]) {
            var c = this.contents[0][id];
            if (!c.portOffset || c.portOffset === this.portOffset) {
                setImmediate(function (idea) {
                    idea.run.call(idea);
                }, c);
            }
        }
    };

    /**
     * Return savable object
     *
     * @method toSimple
     * @returns {Object}
     */
    Region.prototype.toSimple = function () {
        var simple = Idea.prototype.toSimple.call(this);
        simple.buffer = this.buffer;
        simple.portOffset = this.portOffset;
        return simple;
    };
}
Region.prototype = new Idea();
Region.prototype.constructor = Region;

Anslem.Region = Region;