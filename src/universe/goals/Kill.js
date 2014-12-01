/**
 * Kill target
 *
 * @module Anslem.Universe.Goals
 * @class Kill
 * @static
 */
Goals.Kill = {
    description: "Kill target",
    label: "Kill",
    getAction: function (params) {
        var dist = this.distanceTo(params.x, params.y);
        if (dist < this.width)
            return new Actions.Attack({dir: params.x > this.x ? 1 : -1, target: params});
        return Goals.Goto.getAction.call(this, params);
    }
};