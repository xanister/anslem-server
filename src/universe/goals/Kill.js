/**
 * Kill target
 *
 * @module Anslem.Universe.Goals
 * @class Kill
 * @static
 */
Goals.Kill = {
    id: goalIdCounter++,
    description: "Kill target",
    label: "Kill",
    getAction: function () {
        var dist = this.distanceTo(this.focus.x, this.focus.y);
        if (dist < this.width)
            return new Actions.Attack({dir: this.focus.x > this.x ? 1 : -1, target: this.focus});
        return Goals.Goto.getAction.call(this);
    }
};