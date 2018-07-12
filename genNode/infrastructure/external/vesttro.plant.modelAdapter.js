const VesttroApi = require('./VesttroSchedulingApi');
const MathHelper = require('../../helpers/MathHelper');
const DateHelper = require('../../helpers/DateHelper');

class VesttroPlantModelAdapter{
    constructor(plantId, workcenters = []){
        this._workcenters = workcenters;
        this._vesttroApi = new VesttroApi(plantId);
        this.descriptor = 'VESTTRO.PLANT.API';
    }
   
    retrieveSapData(){
        return new Promise((resolve, reject) => {
            let model = {};
            this._retrieveOperations().then(operations => model = operations)
                                      .then(() => this._retrievePersonCapacity()).then(capacity => {
                                        model.dataInicial = DateHelper.nextMonday();
                                        model.dataFinal = DateHelper.dateFromSapDate(capacity[capacity.length -1].CapacityDate, capacity[capacity.length -1].StartTime)
                                        model.personCapacity = capacity;
                                        })
                                      .then(() => this._retrieveWorkCenterCapacity()).then(capacity => model.workcenterCapacity = capacity)
                                      .then(() => this._retrieveCalendar()).then(calendar => model.calendar = calendar)
                                      .then(() => this._retrieveAssetPersonAbility()).then(classification => model.assetPersonAbility = classification)
                                      .then(() => this._retrievePersonQualification()).then(qualification => model.qualification = qualification)
                                      .then(() => resolve(model)).catch(reject);
        });
    }

    _retrieveOperations(){
        return new Promise((resolve, reject) => {
            const sapOperationData = {};
            this._vesttroApi.getOperationDataByPlantId().then(operations => sapOperationData.operations = JSON.parse(operations).d.results.filter(oper => this._workcenters.indexOf(oper.WorkCntr) !== -1))
                                               .then(() => resolve(sapOperationData)).catch(reject);
        });
    }

    _retrieveAssetPersonAbility(){
        return new Promise((resolve, reject) => this._vesttroApi.getAssetPersonAbilityData().then(classification => resolve(JSON.parse(classification).d.results)).catch(reject));        
    }

    _retrievePersonCapacity(){
        return new Promise((resolve, reject) => this._vesttroApi.getPersonCapacitysData().then(capacity => resolve(JSON.parse(capacity).d.results)).catch(reject));
    }
    
    _retrievePersonQualification(){
        return new Promise((resolve, reject) => this._vesttroApi.getPersonQualificationData().then(quelification => resolve(JSON.parse(quelification).d.results)).catch(reject));
    }

    _retrieveWorkCenterCapacity(){
        return new Promise((resolve, reject) => this._vesttroApi.getWorkCenterCapacitysData().then(capacity => resolve(JSON.parse(capacity).d.results)).catch(reject));
    }

    _retrieveCalendar(){
        return new Promise((resolve, reject) => this._vesttroApi.getMachineCalendarData().then(calendar => resolve(JSON.parse(calendar).d.results)).catch(reject));
    }   
}

module.exports = VesttroPlantModelAdapter;