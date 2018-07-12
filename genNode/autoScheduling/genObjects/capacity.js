const Interval = require("./interval");
const DateHelper = require('../../helpers/DateHelper');

class Capacity {
    constructor() {
        this.dayCapacity = {};
    }

    /**
     * @param {Date} date 
     */
    getByDate(date){
        return this.dayCapacity[`${date.getFullYear()}${date.getMonth()}${date.getDate()}`];
    }
    /**
     * @param {{Plant, PersonNumber, PersonName, Capacity, CapacityDate, StartTime}} sapModel 
     */
    addFromSapModel(sapModel) {
        // this.model = sapModel;
        const day = DateHelper.dateFromSapDate(sapModel.CapacityDate, sapModel.StartTime);
        const key = `${day.getFullYear()}${day.getMonth()}${day.getDate()}`;//day.toLocaleDateString();
        this.dayCapacity[key] = {
            key: key,
            shiftStart: day,
            nextStart: new Date(day),
            capacity: parseFloat(sapModel.Capacity) * 0.90,
            available: parseFloat(sapModel.Capacity) * 0.90,
            // model: sapModel
        };
    }

    original(){
        const clone = new Capacity();
        for(let prop in this.dayCapacity){
            //clone.addFromSapModel(this.dayCapacity[prop].model);
            clone.dayCapacity[prop] = {
                key: this.dayCapacity[prop].key,
                shiftStart: this.dayCapacity[prop].shiftStart,
                nextStart: new Date(this.dayCapacity[prop].shiftStart),
                capacity: this.dayCapacity[prop].capacity,
                available: this.dayCapacity[prop].capacity,
            };
        }
        return clone;
    }

    reset(){
        for(let prop in this.dayCapacity){
            this.dayCapacity[prop].available = this.dayCapacity[prop].capacity;
            this.dayCapacity[prop].nextStart = new Date(this.dayCapacity[prop].shiftStart);
        }
    }
}

module.exports = Capacity;