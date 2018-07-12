const DateHelper = require("../../helpers/DateHelper");
const Interval = require("./interval");
const User = require("./user");

const MAX_QUALIFICATION = 20;

class Task {
    constructor() {
        this.fitness = 0;

        this.code = ''; //--> Orderid + Activity + SubActivity
        this.orderId = '';
        this.activity = '';
        this.priority = 0;  // --> Priority - Uma composição entre a prioridade de ordem vs tipo de operação e ordem (tem em regra dinamica)
        this.workcenter = ''; //--> Plant + WorkCntr
        this.duration = 1;
        this.totalDuration = this.duration;
        this.requiredStoppedCondition = false;  // --> FlagParada
        this.interval = {};//Interval.getDefaultTurn(); //--> EarlSchStartD + EarlSchStartT, EarlSchFinisD + EarlSchFinisT
        this.personsRequired = 1;
        this.requiredMatereal = []; //--> Material? // Não pode programar se faltar material
        this.technicalObjectKey = ''; // --> Funcloc || Equipment
        this.hasDateRestriction = false; //--> tentar preservar
        this.technicalObject = null;
        this.subtasks = [];
        this.users = [];
        this.usersRank = {};
        this.SumQualification = 0;
        this.AvgQualification = 0;
    }

    attachOperation(operation) {
        this.code = operation.Orderid + operation.Activity + operation.SubActivity;
        this.orderId = operation.Orderid;
        this.activity = operation.Activity;
        this.priority = this._getPriority(operation);
        this.requiredStoppedCondition = operation.FlagParada === 'X';
        this.workcenter = operation.WorkCntr;        
        this.duration = parseFloat(operation.DurationMinute);
        this.totalDuration = this.duration;
        this.personsRequired = operation.NumberOfCapac;
        this.hasDateRestriction = (parseInt(operation.ConstTypeStart) || 0) !== 0 || (parseInt(operation.ConstTypeFinis) || 0) !== 0;
        this.interval = new Interval(
            DateHelper.dateFromSapDate(operation.EarlSchStartD, operation.EarlSchStartT),
            DateHelper.dateFromSapDate(operation.EarlSchFinisD, operation.EarlSchFinisT)
        );
        this.technicalObjectKey = operation.Equipment || operation.Funcloc;
        this.requiredMatereal = []; //--> Material? // Não pode programar se faltar material
        this.SumQualification = 0;
        this.AvgQualification = 0;
    }

    /**
     * @param {{Orderid, Activity, SubActivity, Priority, FlagParada, Plant, WorkCntr, DurationMinute, NumberOfCapac, ConstTypeStart, EarlSchStartD, EarlSchStartT, EarlSchFinisD, EarlSchFinisT, Equipment, Funcloc, DinamicPriority}} operation 
     */
    _getPriority(operation){
        const p = operation.DinamicPriority / operation.maxPriority;
        if (p <= 0.14) return 1;
        if (p <= 0.28) return 2;
        if (p <= 0.42) return 3;
        if (p <= 0.56) return 5;
        if (p <= 0.70) return 8;
        if (p <= 0.84) return 13;
        if (p <= 1) return 21;
    }

    original() {
        const original = new Task();
        original.interval = new Interval(this.interval.start, this.interval.end);
        original.code = this.code;
        original.orderId = this.orderId;
        original.activity = this.activity;
        original.priority = this.priority;
        original.requiredStoppedCondition = this.requiredStoppedCondition;
        original.workcenter = this.workcenter;
        original.duration = this.duration;
        original.totalDuration = this.totalDuration;
        original.personsRequired = this.personsRequired;
        original.hasDateRestriction = this.hasDateRestriction;
        original.technicalObjectKey = this.technicalObjectKey;
        original.requiredMatereal = this.requiredMatereal;
        original.technicalObject = this.technicalObject;
        original.subtasks = this.subtasks.map(subtask => subtask.original());
        return original;
    }
    
    clone(){
        const clone = this.original();
        clone.users = [...this.users];
        clone.subtasks = this.subtasks.map(subtask => subtask.clone());
        return clone;
    }

    attachTechnicalObject(techObject) {
        this.technicalObject = techObject;
    }

    /**
     * @param {User} user 
     */
    attachUser(user) {
        [this, ...this.subtasks].forEach(task => {
            if (task.users.indexOf(user.code) === -1 && user.hasAffinityExclusive(task)) {
                task.users.push(user.code);
                this.usersRank[user.code] = user.getRankingByTask(task);
                task.SumQualification += this.usersRank[user.code];
                task.AvgQualification = task.users.length ? (task.SumQualification / task.users.length) : 0;
            }
        });
    }

    detachUser(userCode) {
        [this, ...this.subtasks].forEach(task => {
            const idx = task.users.indexOf(userCode);
            if (idx !== -1) {
                task.users.splice(idx, 1);
            }
        });
    }

    getConfig() {
        return {
            stopFactor: 99,
            personFactor: 9,
            qualificationFactor: 89,
            priorityFactor: 22 //max priority + 1
        };
    }

    /**
     * ((2*|Pr-Pa|*Fp))+(|Sr-Sa|*Fs)+(2*(Qr-Qa)*Fq))*|Fd-D|
     * F = Fator
     * R = Requerido
     * A = Recebido
     * ---
     * P = Pessoas
     * S = Maquina parada
     * Q = Qualificação
     * D = Prioridade Dinamica
     */
    computeFitness() {
        this.fitness = 0;
        const config = this.getConfig();

        let stopRequired = this.requiredStoppedCondition ? 1 : 0;
        let stopAvailable = (this.technicalObject && (this.technicalObject.workingCalendar.isAvailable(this.interval.start) || this.technicalObject.workingCalendar.isAvailable(this.interval.end))) ? 1 : 0;
        let qualificationDelta = (this.AvgQualification < MAX_QUALIFICATION) ? (MAX_QUALIFICATION - this.AvgQualification) : 0;

        this.fitness = (( 2 * Math.abs(this.personsRequired - this.users.length) * config.personFactor)
            + ( Math.abs(stopRequired - stopAvailable) * config.stopFactor)
            + ( 2 * (qualificationDelta) * config.qualificationFactor))
            * Math.abs(config.priorityFactor - this.priority) / 1000;
        
        return this.fitness;
    }

}

module.exports = Task;