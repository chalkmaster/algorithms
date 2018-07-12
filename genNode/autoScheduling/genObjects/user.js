const Disponibility = require("./disponibility");
const Interval = require("./interval");
const Capacity = require("./capacity");
const Task = require("./task");

const USER_KIND = { REAL: 0, VIRTUAL: 1 };

class User {
    constructor() {
        this.code = '';
        this.type = USER_KIND.VIRTUAL; // real ou virtual
        this.totalCapacity = 0;
        this.remaningCapacity = 0;
        this.totalWorkLoad = 0;
        this.workcenter = [];
        this.tasks = [];
        this.capacity = {}; //new Capacity();
        this.speciality = { technicalObjectKey: '', ranking: 0};
        this.qualification = { technicalObjectKey: '', validity: {}, controlKey: '',  qualification: '', characteristic: '' }
    }

    /**
     * @param {{Plant, PersonNumber, PersonName, Capacity, CapacityDate, StartTime}} personData 
     */
    loadFromSapModel(personData) {
        this.type = USER_KIND.REAL;
        this.code = personData.PersonNumber;
        this.name = personData.PersonName;
        this.capacity = new Capacity();
        // this.person = personData;
    }

    /**
     * @param {{Plant, PersonNumber, PersonName, Capacity, CapacityDate, StartTime}} personData 
     */
    addCapacity(personData){
        this.capacity.addFromSapModel(personData);
        this.totalCapacity += parseFloat(personData.Capacity);
        this.remaningCapacity += this.totalCapacity;
    }

    /**
     * @param {{Plant, Pernr, Asset, AssetType, Ranking}} specialityData
     */
    addSpeciality(specialityData){
        const key = specialityData.Asset;
        const ranking = specialityData.Ranking;
        this.speciality[key] = {
            technicalObjectKey: key,
            ranking: ranking
        };
    }

    /**
     * 
     * @param {{Plant, Asset, Pernr, AssetType, Qualification, ControlKey, Characteristic, InitialDate, FinalDate}} qualification 
     */
    addQualification(qualification){
        this.qualification[qualification.Asset] = {
            technicalObjectKey: qualification.Asset,
            validity: new Interval(qualification.InitialDate, qualification.FinalDate),
            controlKey: qualification.ControlKey,
            qualification: qualification.Qualification,
            characteristic: qualification.Characteristic
        };        
    }
    
    /**
     * @param {Task} task
     */
    getRankingByTask(task){
        const speciality = this.speciality[task.technicalObjectKey];
        if (!speciality) return 0;
        if (speciality.expires){
            return task.interval.inConflicInterval(speciality.validity) ? speciality.ranking : 0;
        } 

        return speciality.ranking;
    }

    /**
     * @param {string} workcenter 
     */
    addWorkcenter(workcenter){
        if (this.workcenter.indexOf(workcenter) === -1){
            this.workcenter.push(workcenter);
        }
    }

    original() {
        const original = new User();
        original.type = this.type;
        original.code = this.code;
        original.name = this.name;        
        original.totalCapacity = this.totalCapacity;
        original.remaningCapacity = original.totalCapacity;
        original.workcenter = this.workcenter;
        original.speciality = this.speciality;
        original.capacity = this.capacity;//this.capacity.original();
        original.qualification = this.qualification;
        return original;
    }

    clone(){
        const clone = this.original();
        clone.tasks = [...this.tasks];
        return clone;
    }

    /**
     * @param {Task} task operação
     * @returns {bool} Se o usuário possui a especialidade necessária para fazer a tarefa ou uma de suas subtarefas
     */
    hasAffinity(task) {
        return this.hasAffinityExclusive(task) || task.subtasks.some(subtask => this.hasAffinityExclusive(subtask));
    }

    /**
     * @param {Task} task operação
     * @returns {bool} Se o usuário possui a especialidade necessária para fazer a tarefa
     */
    hasAffinityExclusive(task) {
        return this.workcenter.indexOf(task.workcenter) !== -1 && this.isQualified(task);
    }

    isQualified(task){
        return !(this.qualification[task.technicalObjectKey] && this.qualification[task.technicalObjectKey].controlKey === task.controlKey) 
            || (this.qualification[task.technicalObjectKey] && this.qualification[task.technicalObjectKey].controlKey === task.controlKey
            && this.qualification[task.technicalObjectKey].validity.inInterval(task.interval.start) 
            && this.qualification[task.technicalObjectKey].validity.inInterval(task.interval.end));
    }    

    /**
     * Atribui a tarefa ao usuário
     * @param {Task} taskToAdd Tarefa a ser atribuida ao usuário
     */
    attachTask(taskToAdd) {
        const allTasks = [taskToAdd, ...taskToAdd.subtasks];
        for (let i = 0; i < allTasks.length; i++){
            if (this.tasks.indexOf(allTasks[i].code) === -1 && this.hasAffinityExclusive(allTasks[i])) {
                this.totalWorkLoad += allTasks[i].duration;
                this.remaningCapacity -= allTasks[i].duration;
                this.tasks.push(allTasks[i].code);
            }
        }
    }

    /**
     * @param {Task} taskToDetach 
     */
    detachTask(taskToDetach) {
        const allTasks = [taskToDetach, ...taskToDetach.subtasks];
        for (let i = 0; i < allTasks.length; i++){
            const idx = this.tasks.indexOf(allTasks[i].code);
            if (idx !== -1) {
                this.tasks.splice(idx, 1);
                this.totalWorkLoad -= allTasks[i].duration;
                this.remaningCapacity += allTasks[i].duration;
            }
        }
    }

}
module.exports = User;