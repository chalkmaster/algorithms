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
                if (!p.user || !p.task || !plan.tool || !plan.user || !plan.task)
                    return false;
                return (p.user.code == plan.user.code || p.tool.code == plan.tool.code) && (p.hour >= plan.hour || p.hour < (plan.hour + plan.task.workload));
            });
            const hasConcurrency = concurrentPlans && concurrentPlans.length > 0;

            if (!plan.user || hasConcurrency)
                plan.fitness *= 2;

            totalFitness += plan.fitness;
        }
        this.fitness = totalFitness;
        return this.fitness;
    }
};