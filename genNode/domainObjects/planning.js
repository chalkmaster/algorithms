const Plan = require('../domainObjects/plan');

module.exports = class Planning{
    /**
     * 
     * @param {Plan[]} planList 
     */
    constructor(planList){
        this.planList = planList;
        this.fitness = fitness;
    }

    /**
     * Avalia o planejamento
     */
    computeFitness() {
        const concurrencyFilter = (p) => {
            return (p.user.code == plan.user.code || p.tool.code == plan.tool.code) && (p.hour >= plan.hour || p.hour < (plan.hour + plan.task.workload));
        };

        let totalFitness = 0;

        for (let plan of this.planList) {
            const concurrentPlans = this.planList.filter(concurrencyFilter);
            const hasConcurrency = concurrentPlans && concurrentPlans.length > 0;

            if (!plan.user || hasConcurrency)
                plan.fitness *= 2;

            totalFitness += plan.fitness;
        }
        this.fitness = totalFitness;
        return this.fitness;
    }
};