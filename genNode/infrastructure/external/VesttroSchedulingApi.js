const request = require('request');
const API_REFERENCE = require('./vesttro.apireference');

const SCHEDULING_SET = 'SchedulingSet';
const OPERATION_SET = 'OperationSet';
const MACHINE_SET = 'MachineCalendarSet';
const AI_SET = 'ODATA_AI_SRV';
const RESOURCES_SET = 'ResourcesSummarySet';

class VesttroSchedulingApi {
    constructor(plantId = 1000) {
        this.plantId = plantId;
        this.sapAPIUrl = this.getSAPURL();
    }
    getSchedulingData(schedulingId) {
        return this._getData(this._getSchedulingApiUrl(schedulingId));
    }

    getOperationDataBySchedulingId(schedulingId) {
        return this._getData(this._getOperationApiUrl(schedulingId));
    }

    getOperationDataByPlantId() {
        return this._getData(this._getPlantOperationApiUrl());
    }

    getMachineCalendarData() {
        return this._getData(this._getMachineCalendarApiUrl());
    }

    getResourcesCapacitysData() {
        return this._getData(this._getCapacityApiUrl());
    }

    getPersonCapacitysData() {
        return this._getData(this._getPersonCapacityUrl());
    }

    getWorkCenterCapacitysData() {
        return this._getData(this._getWorkcenterCapacityUrl());
    }

    getAssetPersonAbilityData() {
        return this._getData(this._getAssetPersonAbilityUrl());
    }

    getPersonQualificationData() {
        return this._getData(this._getPersonQualificationUrl());
    }

    getSAPURL() {
        return this._getData(this._getAiConfigUrl());
    }

    _getData(apiUrl = '') {
        return new Promise((resolve, reject) => {
            request.get(apiUrl, (err, resp, body) => {
                if (err || resp.statusCode !== 200)
                    reject({ error: err, statusCode: resp.statusCode, statusMessage: resp.statusMessage });
                else
                    resolve(body);
            }).auth(process.env.SAP_USER, process.env.SAP_PASS, false);
        });
    }

    _getSchedulingApiUrl(schedulingId) {
        // return `${process.env.SAP_API_URL}/${API_REFERENCE.SCHEDULING_ENDPOINT}/${SCHEDULING_SET}?$expand=Operation%2COperationRelation%2COperationPrt%2CAllocation&$format=json&$filter=PlanningId%20eq%20%27${this._schedulingId}%27`;
        return `${process.env.SAP_API_URL}/${API_REFERENCE.SCHEDULING_ENDPOINT}/${SCHEDULING_SET}?$format=json&$filter=PlanningId%20eq%20%27${schedulingId}%27`;
    }

    _getOperationApiUrl(schedulingId) {
        return `${process.env.SAP_API_URL}/${API_REFERENCE.SCHEDULING_ENDPOINT}/${OPERATION_SET}?$format=json&$filter=PlanningId%20eq%20%27${schedulingId}%27`;
    }

    _getPlantOperationApiUrl() {
        // /sap/opu/odata/SSCN/ODATA_AI_SRV/OperationSet?$filter=Plant eq '1000'&$format=json
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/OperationSet?$filter=Plant%20eq%20%27${this.plantId}%27&$format=json`;        
    }

    _getMachineCalendarApiUrl() {
        return `${process.env.SAP_API_URL}/${API_REFERENCE.MACHINE_CALENDAR_ENDPOINT}/${MACHINE_SET}?$format=json`;
    }

    _getCapacityApiUrl() {
        return `${process.env.SAP_API_URL}/${API_REFERENCE.SCHEDULING_ENDPOINT}/${RESOURCES_SET}?$format=json&$filter=PlanningId%20eq%20%27${this.plantId}%27`;
    }

    _getPersonCapacityUrl(plant = this.plantId) {
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/PersonCapacitySet?$filter=Plant%20eq%20%27${plant}%27&$format=json`;
    }

    _getWorkcenterCapacityUrl(plant = this.plantId) {
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/WorkCenterCapacitySet?$filter=Plant%20eq%20%27${plant}%27&$format=json`;
    }

    _getAssetPersonAbilityUrl(plant = this.plantId) {
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/AssetPersonAbilitySet?$filter=Plant%20eq%20%27${plant}%27&$format=json`;
    }

    _getPersonQualificationUrl() {
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/PersonQualificationSet?$format=json`;
    }

    _getAiConfigUrl() {
        return `${process.env.SAP_API_URL}/ODATA_AI_SRV/ConfigParamSet?$filter=CfgParamKey%20eq%20%27SAP.ADDRESS%27&$format=json`;
    }
}

module.exports = VesttroSchedulingApi;