/**
 * Position.js
 * Universal positional representation
 *
 * Author: Nicholas Frees
 * Date: 11/23/2014
 */

/**
 * Universal positional representation
 * @param {Idea} container
 * @param {Number} x
 * @param {Number} y
 * @param {Number} width
 * @param {Number} height
 * @returns {Position}
 */
function Position(container, x, y, width, height) {
    /**
     * Parent object
     * @access public
     * @var &Idea
     */
    this.container = container || false;

    /**
     * Local x coord
     * @access public
     * @var {Number}
     */
    this.x = x || 0;

    /**
     * Local y coord
     * @access public
     * @var {Number}
     */
    this.y = y || 0;

    /**
     * Size in x dimension
     * @access public
     * @var {Number}
     */
    this.width = width || 0;

    /**
     * Size in y dimension
     * @access public
     * @var {Number}
     */
    this.height = height || 0;
}

module.exports = Position;