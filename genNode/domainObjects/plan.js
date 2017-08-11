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
    constructor(planTask, planUser = null, planTool = null) {
        this.id = '';
        this.fitness = 0;
        this.hour = 0;
        this.task = planTask;
        this.user = planUser;
        this.tool = planTool;
        this.penaltyReasons = 0;
        this.reason = '';
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
    computeFitness() {
        const delayPenalty = 30;
        const lowCriticalityPenalty = 15;
        const invalidUserPenalty = 100;
        const invalidTaskPenalty = 100;
        const invalidToolPenalty = 100;

        let penaltySum = 0;

        if (!this.user) {
            penaltySum += invalidUserPenalty;
            this.penaltyReasons += 2;
        }

        if (this.task) {
            let delayFault = Math.min(dateHelper.daysDiffAbs(this.getPlanDate(), this.task.createdAt), delayPenalty);

            if (delayFault > 16)
                this.penaltyReasons += 1;

            penaltySum += delayPenalty - delayFault;
            this.penaltyReasons += 4;

            if (this.task.criticality === criticalityKind.HIGH)
                this.penaltyReasons += 8;
            else if (this.task.criticality === criticalityKind.MEDIUM) {
                penaltySum += 5;
                this.penaltyReasons += 16;
            } else {
                penaltySum += 10;
                this.penaltyReasons += 32;
            }

            if (!this.tool && this.task.requiredTool) {
                penaltySum += invalidToolPenalty;
                this.penaltyReasons += 128;
            }
        }
        else {
            penaltySum += invalidTaskPenalty;
            this.penaltyReasons += 64;
        }


        this.fitness = 145 - penaltySum;
        this.reason = this.getReason();
        return this.fitness;
    }

    getReason() {
        let response = `o plano `;
        if (this.penaltyReasons == 0)
            response += `não foi avaliado em relação a penalidades `;
        //usuario
        if ((this.penaltyReasons & 2) == 2)
            response += `não encontrou um usuário disponível para realizar a demanda `;
        else if ((this.penaltyReasons & 64) == 64)
            response += `possui um usuário sem tarefa para realizar `;
        else if ((this.penaltyReasons & 128) == 128)
            response += `não conseguiu encontrar a ferramenta necessária pra executar a tarefa `;

        //atraso        
        if ((this.penaltyReasons & 3) == 3 || (this.penaltyReasons & 129) == 129)
            response += `porém ela ficará mais de 30 dias sem atuação e por isto necessita atenção `;
        else if ((this.penaltyReasons & 1) == 1)
            response += `foi cadastrado a mais de 30 dias e necessita atenção `;

        //task
        if ((this.penaltyReasons & 66) == 66)
            response += `e também não possui nenhuma tarefa a ser executada `;

        //criticidade
        if ((this.penaltyReasons & 9) == 9)
            response += `principalmente por sua alta criticidade `;
        else if ((this.penaltyReasons & 8) == 8)
            response += `além disto possui alta criticidade `;
        else if ((this.penaltyReasons & 17) == 17)
            response += `mesmo com criticidade média `;        
        else if ((this.penaltyReasons & 16) == 16)
            response += `além disto possui criticidade média `;
        else if ((this.penaltyReasons & 33) == 33)
            response += `apesar de sua baixa criticidade `;        
        else if ((this.penaltyReasons & 32) == 32)
            response += `além disto possui criticidade baixa `;

        return response;            
    }
    /**
     * Ajusta a hora prevista de execução do plano baseado na sua posição na população
     * @param {Number} planPosition 
     */
    adjusteHourByPosition(planPosition) {
        if (!this.task || !this.user)
            return;
        this.hour = planPosition + this.user.workCapacity - (this.task.workload + this.user.getRemaningWorkCapacity());
    }
};