const criticalityKind = require('../domainObjects/criticalityKind');
const resourceService = require('./resourceService');

module.exports = class genService {
    constructor() {
        this.resources = new resourceService();
        this.config = {
            workingDays: 7
        }
    }

    getResources() {
        return this.resources;
    }

    run(config) {
        let population = this.generateInitialPopulation();
        let generationSnapshots = [];
        let lastGeneration = {
            population: [...population],
            fitness: this.computePopulationFitness(population),
        };

        if (lastGeneration.fitness == 0)
            return lastGeneration;

        for (let i = 0; i < config.maxGenerations; i++) {
            let selection = this.select(population)
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


        return lastGeneration;
    }

    select (population){
        let selected = [];

        return selected;
    }
    computePopulationFitness(population) {
        const daysToDistribute = this.config.workingDays;
        //avalia para cada dia
        let totalFitness = 0;

        for (var day = 0; day < daysToDistribute; day++) {
            let daySelection = population.filter((i) => { return i.plan.day === day });
            for (let individual of daySelection) {
                let hourFault = false;
                let toolConflict = false;

                //Conflito de horario do usuário
                if (individual.plan.user) {
                    let tasksSameHour = population.filter((i) => {
                        return i.plan.user
                            && i.plan.user.code === individual.plan.user.code
                            && (i.plan.hour >= individual.plan.hour && i.plan.hour + i.plan.task.workload <= individual.plan.hour)
                    });
                    hourFault = tasksSameHour.length > 0;
                }

                //Conflito de ferramenta                
                if (individual.plan.tool) {
                    let toolSameHour = population.filter((i) => {
                        return i.plan.tool
                            && i.plan.tool.code === individual.plan.tool.code
                            && (i.plan.hour >= individual.plan.hour && i.plan.hour + i.plan.task.workload <= individual.plan.hour)
                    });
                    toolConflict = toolSameHour.length > 0;
                }

                if (hourFault)
                    individual.fitness += 30;

                if (toolConflict)
                    individual.fitness += 30;

                totalFitness += individual.fitness;
            }
        }
        let sortedPopulation = population.sort((a,b)=>{ return a.fitness > b.fitness ? 1 : -1; });
        return {populationFitness: totalFitness, population: sortedPopulation};
    }

    /**
     * O quaão saldável é o indivíduo
     * @param {*} plan 
     */
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

        let timeDiff = fitnessScores.oldFactor - Math.min(Math.abs(this.getBaseDate(plan) - plan.task.createdAt) / 36e5 / 100, fitnessScores.oldFactor);
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

    getBaseDate(plan) {
        let baseDate = new Date();
        let day = baseDate.getDate();
        let hour = baseDate.getHours();
        baseDate.setDate(day + plan.day);
        baseDate.setHours(hour + plan.intialHour);
        return baseDate;
    }

    /**
     * inicializa uma populção válida
     * TODO: adicionar recurso para usar estatísticas do passado para melhorar a 
     * inicialização (a cada dia fica mais inteligente)
     * @param {Number} populationSize 
     */
    generateInitialPopulation(populationSize) {
        let population = [];
        for (let day = 0; day < this.config.workingDays; day++) {
            for (let i = 0; i < Math.ceil(populationSize / this.config.workingDays); i++) {
                const validPlan = this.getValidPlan(day);
                
                if (!validPlan)
                    break;

                population.push({
                    plan: validPlan,
                    fitness: this.computePlanFitness(validPlan),
                });
                if (population.length >= populationSize)
                    break;
            }
            if (population.length >= populationSize)
                break;

            //reinicia os resources para o dia seguinte
            if (this.resources.tasks.length == 0)
                break;

            let tasks = this.resources.tasks;
            this.resources = new resourceService();
            this.resources.tasks = tasks;
        }
        return population;
    }

    /**
     * Inicializa um indivíduo válido
     * TODO: adicionar recurso para tentar inicializar já com cenários que deram certo no passado.
     */
    getValidPlan(planDay) {
        const resources = this.getResources();
        const planTask = resources.tasks.shift();
        if (!planTask)
            return;

        let { planTool, planUser } = getTaskPlan(planTask);
        let workDelta = planUser ? (planUser.workCapacity - planUser.getWorkload()) : 0;

        return {
            day: planDay, //gen
            intialHour: 8 + workDelta - planTask.workload, //gen 
            task: planTask, //meta-info
            tool: planTool, //gen
            user: planUser, //gen
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
                    if (resources.users[i].skills.indexOf(task.requiredSkill) != -1 && resources.users[i].getWorkload() - task.workload > -2) {
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