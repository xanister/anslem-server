/**
 * Compile all actions and goals and return Goals module
 *
 * @module Anslem.Universe.Goals
 * @requires AnslemServerConfig, compileActions
 */
var AnslemServerConfig = require("./../AnslemServerConfig");
var Actions = require('./compileActions');

/**
 * Goals
 *
 * @class Goals
 * @static
 */
var Goals = {};