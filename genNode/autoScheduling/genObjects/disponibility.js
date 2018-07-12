// const Interval = sap.ui.requireSync('br/com/sigga/ai/autoScheduling/genObjects/interval');
const Interval = require("./interval");

class Disponibility {
    constructor() {
        this.shift = Interval.getDefaultTurn();
        this.dailyBreaks = [];//[Interval.getDefaultLunchTime(), Interval.getDefaultCoffeTime()];
        this.workDays = [1, 2, 3, 4, 5, 6]; //0 == sunday, 7 == saturday
        this.daysOff = [];//[Interval.getDefaultVacation()];
    }

    isAvailable(dateToCheck) {
        return this.workDays.indexOf(dateToCheck.getDay()) !== -1 // is a working day
            && this.shift.inTimeInterval(dateToCheck)  // and is into turn interval
            && !this.dailyBreaks.some(interval => interval.inTimeInterval(dateToCheck)) // and not in a break
            && !this.daysOff.some(interval => interval.inInterval(dateToCheck)); // and not a day off
    }

    loadFromSapModel(sapModel = {}) {
    }

    loadFullCapacity() {
        this.shift.start.setHours(0, 0, 0, 0);
        this.shift.end.setHours(23, 59, 59, 999);

        this.dailyBreaks = [];
        this.workDays = [0, 1, 2, 3, 4, 5, 6, 7]; //0 == sunday, 7 == saturday
        this.daysOff = [];
    }

    addDayOff(interval) {
        this.daysOff.push(interval);
    }
}

module.exports = Disponibility;
// sap.ui.define(() => { return Disponibility; });