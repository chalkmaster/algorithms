const Plan = require('../domainObjects/plan');

module.exports = class Planning {
    /**
     * 
     * @param {Plan[]} planList 
     */
    constructor(planList) {
        this.planList = planList;
        this.fitness = 0;
        this.id = 0;
    }

    /**
     * Avalia o planejamento
     */
    computeFitness() {
        let totalFitness = 0;

        for (let plan of this.planList) {
            if (!plan) continue;

            const concurrentPlans = this.planList.filter((p) => {
                let result = false;
                if (!p || p.id == plan.id)
                    return false;

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

            if (!plan.user){
                penalty = plan.fitness / 2;
                penalty += (plan.task ? (plan.task.workload * 2) : 0);
            }

            if (hasConcurrency)
                penalty += penalty / 2;

            totalFitness += (plan.fitness - penalty);
        }
        this.fitness = totalFitness;
        return this.fitness;
    }

    adjustStartHourForAllPlans() {
        let control = [];
        for (let plan of this.planList) {
            if (!plan) continue;
            if (plan.user && plan.task) {
                if (!control[plan.user.code]) {
                    plan.hour = 0;
                    control[plan.user.code] = plan.task.workload;
                }
                else {
                    plan.hour = control[plan.user.code];
                    control[plan.user.code] += plan.task.workload;
                }
            }
        }
    }

    adjustStartHour(startHour) {
        let control = [];
        for (let i = 0; i< this.planList.length; i++){
            let plan = this.planList[i];
            if (!plan || plan.hour <= startHour) continue;

            if (plan.user && plan.task) {
                if (!control[plan.user.code]) {
                    if (i ==0)
                        plan.hour = 0;
                    else 
                        plan.hour = this.planList[i -1].hour + (this.planList[i-1].task ? this.planList[i-1].task.workload : 0);
                    control[plan.user.code] = plan.task.workload;
                }
                else {
                    plan.hour = control[plan.user.code];
                    control[plan.user.code] += plan.task.workload;
                }
            }
        }
    }
};