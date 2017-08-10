const Plan = require('../domainObjects/plan');

module.exports = class Planning {
    /**
     * 
     * @param {Plan[]} planList 
     */
    constructor(planList) {
        this.planList = planList;
        this.fitness = 0;
    }

    /**
     * Avalia o planejamento
     */
    computeFitness() {
        let totalFitness = 0;

        for (let plan of this.planList) {
            const concurrentPlans = this.planList.filter((p) => {
                let result = false;
                if (p.hour >= plan.hour && p.hour < (plan.hour + (plan.task ? plan.task.workload : 0))) {
                    if (plan.user && p.user)
                        if (p.user.code == plan.user.code)
                            result = true;
                    if (plan.tool && p.tool)
                        if (p.tool.code == plan.tool.code)
                            result = true;
                }
                return result;
            });
            const hasConcurrency = concurrentPlans && concurrentPlans.length > 0;

            let penalty = 0;

            if (!plan.user || hasConcurrency)
                penalty = plan.fitness / 2;

            totalFitness += (plan.fitness - penalty);
        }
        this.fitness = totalFitness;
        return this.fitness;
    }
};