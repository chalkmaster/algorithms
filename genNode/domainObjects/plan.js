const dateHelper = require('../helpers/dateHelper');

const criticalityKind = require('../domainObjects/criticalityKind');

const Task = require('./task');
const Tool = require('./toolsKind');
const User = require('./user');

module.exports = class plan {
    /**
     * 
     * @param {Task} planTask tarefa a ser executada
     * @param {User} planUser usuário que irá executar a tarefa
     * @param {Tool} planTool ferramenta planejada para uso
     */
    constructor(planTask, planUser = null, planTool = null){
        this.fitness = 0;      
        this.hour = 0;
        this.task = planTask;
        this.user = planUser;
        this.tool = planTool;
    }

    /**
     * Data e hora planejada
     */
    getPlanDate() {
        let date = new Date();
        date.setHours(date.getHours() + this.hour);
        return date;
    }

    /**
     * O quão saldável é o indivíduo
     */
    ComputeFitness(){
        const delayPenalty = 30;
        const lowCriticalityPenalty = 30;
        const workOverloadPenalty = 30;
        const invalidUserPenalty = 100;
        const invalidTaskPenalty = 100;
        const invalidToolPenalty = 100;

        let penaltySum = 0;

        if (this.user)
            penaltySum += this.user.getRemaningWorkCapacity() < -1 ? workOverloadPenalty : 0;
        else
            penaltySum += invalidUserPenalty;

        if (this.task) {
            penaltySum += delayPenalty - Math.min(dateHelper.daysDiffAbs(this.getPlanDate(), this.task.createdAt), delayPenalty);
            penaltySum += this.task.criticality === criticalityKind.HIGH ? 0 : this.task.criticality === criticalityKind.MEDIUM ? 15 : 30;
        }
        else
            penaltySum += invalidTaskPenalty;

        if (!this.tool)
            penaltySum += invalidToolPenalty;

        this.fitness = penaltySum;
        return this.fitness;
    }

    /**
     * Ajusta a hora prevista de execução do plano baseado na sua posição na população
     * @param {Number} planPosition 
     */
    adjusteHourByPosition(planPosition){
        if (!this.task || !this.user)
            return;
        this.hour = planPosition + this.user.workCapacity - (this.task.workload + this.user.getRemaningWorkCapacity());
    }
};