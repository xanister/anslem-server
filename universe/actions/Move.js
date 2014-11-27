/**
 * Move
 *
 * @class Move
 * @for Actions
 * @param {Object} params direction to move
 */
Actions.Move = function Move(params) {
    Move.description = "Move";
    Move.label = "Move";
    this.params = params;
    Move.prototype.run = function (params) {
        this.xSpeed += (params.dir * 2);
    };
};