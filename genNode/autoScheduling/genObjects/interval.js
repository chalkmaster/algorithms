// const DateHelper = sap.ui.requireSync('br/com/sigga/helpers/DateHelper');
const DateHelper = require("../../helpers/DateHelper");


class Interval {
    constructor(start = new Date(), end = new Date()) {
        this.start = new Date(start);
        this.end = new Date(end);
    }

    static startSorter(a, b) {
        return a.interval.start > b.interval.start ? 1 : -1;
    }

    static startSorterDesc(a, b) {
        return a.interval.start < b.interval.start ? 1 : -1;
    }

    inTimeInterval(dateToCheck) {
        const startDate = new Date(this.start);
        const endDate = new Date(this.end);
        startDate.setFullYear(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
        endDate.setFullYear(dateToCheck.getFullYear(), dateToCheck.getMonth(), dateToCheck.getDate());
        return startDate <= dateToCheck && dateToCheck <= endDate;
    }

    inInterval(dateToCheck) {
        return this.start <= dateToCheck && dateToCheck <= this.end;
    }

    inConflicInterval(intervalToCheck) {
        return (this.start >= intervalToCheck.start && this.start <= intervalToCheck.end)
            || (this.start <= intervalToCheck.start && this.end >= intervalToCheck.end)
            || (this.end >= intervalToCheck.start && this.end <= intervalToCheck.end);
    }

    getDurationInHours() {
        return DateHelper.hoursDiffAbs(this.start, this.end);
    }

    getDurationInDays() {
        this.durationInDays = this.durationInDays || Math.ceil((DateHelper.hoursDiffAbs(this.start, this.end) / 24));
        return this.durationInDays;
    }
    
    getDurationInMinutes() {
        return DateHelper.minutesDiffAbs(this.start, this.end);
    }

    static getDefaultLunchTime() {
        const lunchStart = new Date();
        const lunchEnd = new Date();
        lunchStart.setHours(12, 0, 0, 0);
        lunchEnd.setHours(13, 0, 0, 0);
        return new Interval(lunchStart, lunchEnd);
    }

    static getDefaultCoffeTime() {
        const coffeStart = new Date();
        const coffeEnd = new Date();
        coffeStart.setHours(9, 0, 0, 0);
        coffeEnd.setHours(9, 15, 0, 0);
        return new Interval(coffeStart, coffeEnd);
    }

    static getDefaultVacation() {
        const vacationStart = new Date();
        const vacationEnd = new Date();

        vacationStart.setHours(0, 0, 0, 0);
        vacationEnd.setHours(23, 59, 59, 999);

        vacationStart.setMonth(5, 1);
        vacationEnd.setMonth(5, 30);
        return new Interval(vacationStart, vacationEnd);
    }
    static getDefaultTurn() {
        const turnStart = new Date();
        const turnEnd = new Date();
        turnStart.setHours(9, 0, 0, 0);
        turnEnd.setHours(17, 0, 0, 0);
        return new Interval(turnStart, turnEnd);
    }


}

module.exports = Interval;
// sap.ui.define(() => { return Interval; });
