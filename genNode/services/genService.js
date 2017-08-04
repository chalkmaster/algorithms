const criticalityKind = require('../domainObjects/criticalityKind');
const resourceService = require('./resourceService');

module.exports = class genService {
    constructor() {
        this.resources = new resourceService();
    }

    getResources() {
        return this.resources;
    }

    run(config) {
        let population = this.generateInitialPopulation();
        let generationSnapshots = [];
        let lastGeneration = {
            population: [...population],
            fitness: computePopulationFitness(population),
        };

        if (lastGeneration.fitness == 0)
            return lastGeneration;

        for (let i = 0; i < config.maxGenerations; i++) {
            let selection = select(population)
            let decents = makeCrossOver(selection);
            population = mutate(decents);

            let currentPopulationFitness = computePopulationFitness(population);

            generationSnapshots.push({
                population: [...population],
                fitness: currentPopulationFitness,
            });

            if (currentPopulationFitness == 0)
                break;
        }

        function computePopulationFitness(population) {
            const faultPenality = 999;

        }

        return lastGeneration;
    }

    computePlanFitness(plan) {
        const fitnessScores = {
            oldFactor: 7.2,
            highCriticality: 3,
            workload: 16,
            user: 99,
            tool: 99,
            userRemaningTime: 2,
        };

        const maxScore = fitnessScores.oldFactor
            + fitnessScores.highCriticality
            + fitnessScores.workload
            + fitnessScores.user
            + fitnessScores.tool
            + fitnessScores.userRemaningTime
            ;

        let timeDiff = fitnessScores.oldFactor - Math.min(Math.abs((new Date()) - plan.task.createdAt) / 36e5 / 100, fitnessScores.oldFactor);
        let criticality = plan.task.criticality === criticalityKind.HIGH ? 3 : plan.task.criticality === criticalityKind.MEDIUM ? 2 : 0;
        let workload = fitnessScores.workload - plan.task.workload;
        let nullUserPenalty = !plan.user ? 0 : fitnessScores.user;
        let nullToolPenalty = !plan.tool ? 0 : fitnessScores.tool;
        
        let userWorkload = plan.user ? plan.user.getWorkload() : 0;
        let remaningTime = userWorkload < -2 ? Math.abs(userWorkload) : fitnessScores.userRemaningTime;

        let fitness = maxScore;
        fitness -= timeDiff;
        fitness -= criticality;
        fitness -= workload;
        fitness -= nullUserPenalty;
        fitness -= nullToolPenalty;
        fitness -= remaningTime;

        return fitness;
    }

    generateInitialPopulation(populationSize) {
        let population = [];
        for (let i = 0; i < populationSize; i++) {
            const validPlan = this.getValidPlan();
            population.push({
                plan: validPlan,
                fitness: this.computePlanFitness(validPlan),
            });
        }
        return population;
    }

    getValidPlan() {
        const resources = this.getResources();
        const planTask = resources.tasks.shift();
        let { planTool, planUser } = getTaskPlan(planTask);

        return {
            schedule: new Date(),
            workload: 2,
            task: planTask,
            tool: planTool,
            user: planUser,
        };

        function getTaskPlan(task) {
            let planTool = null;
            let planUser = null;

            if (task.requiredTool) {
                for (var i = 0; i < resources.tools.length; i++) {
                    if (task.requiredTool === resources.tools[i].type) {
                        planTool = resources.tools[i];
                        resources.tools.splice(i, 1);
                        break;
                    }
                }
            }

            if (task.requiredSkill) {
                for (var i = 0; i < resources.users.length; i++) {
                    if (resources.users[i].skills.indexOf(task.requiredSkill) != -1 && resources.users[i].workCapacity - task.workload > -2) {
                        resources.users[i].attachTask(task);
                        planUser = resources.users[i];
                        break;
                    }
                }
            }
            return { planTool, planUser };
        }

    }


    //TODO: Passar para um helper
    //=====================================================
    /**
     * 
     * @param {Number} min valor mínimo que pode ser retornado
     * @param {number} max valor máximo que pode ser retornado
     */
    getRandom(min, max) {
        return Math.floor(min + ((Math.random() * (Math.abs(min) + max)) + 1));
    }
}