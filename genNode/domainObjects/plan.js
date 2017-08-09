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
    getFitness(){
        const delayPenalty = 30;
        const lowCriticalityPenalty = 30;
        const workOverloadPenalty = 30;
        const invalidUserPenalty = 100;
        const invalidTaskPenalty = 100;
        const invalidToolPenalty = 100;

        let fitness = 0;

        if (this.user)
            fitness += this.user.getRemaningWorkCapacity() < -1 ? workOverloadPenalty : 0;
        else
            fitness += invalidUserPenalty;

        if (this.task) {
            fitness += delayPenalty - Math.min(dateHelper.daysDiffAbs(this.getPlanDate(), this.task.createdAt), delayPenalty);
            fitness += this.task.criticality === criticalityKind.HIGH ? 0 : this.task.criticality === criticalityKind.MEDIUM ? 15 : 30;
        }
        else
            fitness += invalidTaskPenalty;

        if (!this.tool)
            fitness += invalidToolPenalty;

        return fitness;
    }

    /**
     * Ajusta a hora prevista de execução do plano baseado na sua posição na população
     * @param {Number} planPosition 
     */
    adjusteHourByPosition(planPosition){
        this.hour = planPosition + this.user.workCapacity - (validPlan.task.workload + user.getRemaningWorkCapacity());
    }
};