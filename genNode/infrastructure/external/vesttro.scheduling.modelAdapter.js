const VesttroApi = require('./VesttroSchedulingApi');
const MathHelper = require('../../helpers/MathHelper');
const DateHelper = require('../../helpers/DateHelper');

class VesttroSchedulingModelAdapter{
    constructor(schedulingId){
        this._schedulingId = schedulingId;
        this._vesttroApi = new VesttroApi();
        this.descriptor = 'VESTTRO.SCHEDULING.API';
    }
   
    retrieveSapData(){
        return new Promise((resolve, reject) => {
            let model = {};
            this._retrieveOperations().then(operations => model = operations)
                                      .then(() => this._retrievePersonCapacity()).then(capacity => model.personCapacity = capacity)
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
            this._vesttroApi.getSchedulingData(this._schedulingId).then(schedulingData => {
                const scheduling = JSON.parse(schedulingData).d.results[0];                
                sapOperationData.dataInicial = DateHelper.dateFromSapDate(scheduling.DataInicial);
                sapOperationData.dataFinal = DateHelper.dateFromSapDate(scheduling.DataFinal); 
                //TODO: Pegar os centros de trabalho que vem na programação, filtrar os centros de trabalho
                // descomentar a criação dos usuarios virtuais                          
            })
            .then(() => this._vesttroApi.getOperationDataBySchedulingId(this._schedulingId))
            .then(operations => sapOperationData.operations = JSON.parse(operations).d.results)
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

module.exports = VesttroSchedulingModelAdapter;