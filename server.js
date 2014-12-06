/**
 * server.js
 * Run the Anslem server
 *
 * Author: Nicholas Frees
 * Date: 11/26/2014
 *
 * @module Anslem
 * @requires AnslemServer
 */
var AnslemServer = require('./src/app/AnslemServer');

var anslemServer = new AnslemServer();
anslemServer.start();

