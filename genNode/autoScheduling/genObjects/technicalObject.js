// const Interval = sap.ui.requireSync('br/com/sigga/ai/autoScheduling/genObjects/interval');
// const Disponibility = sap.ui.requireSync('br/com/sigga/ai/autoScheduling/genObjects/disponibility');
// const DateHelper = sap.ui.requireSync('br/com/sigga/helpers/DateHelper');
const Interval = require("./interval");
const Disponibility = require("./disponibility");
const DateHelper = require("../../helpers/DateHelper");

class TechnicalObject {

    /**
     * prefere to call loadFromSapModel after instantiate instead pass arguments to this constructor
     * @param {String} key Equnr || FuncLoc
     * @param {String} workcenter Plant +  WorkCenter
     */
    constructor(key = '', workcenter = '') {
        this.workingCalendar = new Disponibility();
        this.workingCalendar.loadFullCapacity();
        this.key = key; //Equnr || FuncLoc
        this.workcenter = workcenter; //Plant + WorkCenter
    }

    addStopFromSapModel(scheduleStop) {
        // let sdate = new Date(scheduleStop.StartDate);
        // let fdate = new Date(scheduleStop.FinishDate);
        // sdate.setMilliseconds(scheduleStop.StartTime.ms);
        // fdate.setMilliseconds(scheduleStop.FinishTime.ms);
        this.workingCalendar.addDayOff(
            new Interval(
                DateHelper.dateFromSapDate(scheduleStop.StartDate, scheduleStop.StartTime),
                DateHelper.dateFromSapDate(scheduleStop.FinishDate, scheduleStop.FinishTime)
                // sdate, fdate
            ));
    }

    loadFromSapModel(technicalObject) {
        this.key = technicalObject.FuncLoc || technicalObject.Equnr;
        this.workcenter = technicalObject.Plant + technicalObject.WorkCenter;
        this.addStopFromSapModel(technicalObject);
    }
}
module.exports = TechnicalObject;
// sap.ui.define(() => { return TechnicalObject; });