/**
 * server.js
 * Run the Anslem server
 *
 * Author: Nicholas Frees
 * Date: 11/26/2014
 *
 * @module Anslem
 * @requires RegionServer
 */
var RegionServer = require('./src/app/RegionServer');

// Grab the slug
var regionSlug = process.argv[2] || "universe";

// Create the server
console.log("\n*************************************************************");
console.log("starting " + regionSlug);
console.log("*************************************************************\n");

global.regionServer = new RegionServer(regionSlug);
global.regionServer.start();