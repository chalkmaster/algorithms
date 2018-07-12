Date.prototype.toUTC = function () {
    return new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds());
};