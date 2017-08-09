const criticalityKind = require('../domainObjects/criticalityKind');
const resourceService = require('./resourceService');
const dateHelper = require('../helpers/dateHelper');
const Plan = require('../domainObjects/plan');

module.exports = class genService {
    constructor() {
        this.resources = new resourceService();
        this.config = {
            workingDays: 7,
            workingHours: 8,
            populationSize: 100,
            maxGenerations: 100,
            elitism: 0.1,
        };
    }

    /**
     * @returns {resourceService}
     */
    getResources() {
        return this.resources;
    }

    run() {
        let population = this.generateInitialPopulation();
        let generationSnapshots = [];
        let lastGeneration = {
            population: [...population],
            fitness: this.computePopulationFitness(population),
        };

        if (lastGeneration.fitness == 0)
            return lastGeneration;

        for (let i = 0; i < this.config.maxGenerations; i++) {
            let selection = this.select(population);
            let decents = this.makeCrossOver(selection);
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

    /**
     * 
     * @param {Plan[]} population 
     */
    makeCrossOver(population) {
        let decents = [];
        const elit = this.config.populationSize * this.config.elitism;

        for (let i = 0; i < elit; i += 2) {
            //decents
        }

        for (let i = 0; i < this.config.populationSize - elit; i += 2) {
            let pair1 = population[i];
            //let pair2 = 
        }
    }

    /**
     * 
     * @param {Plan[]} population 
     */
    select(population) {
        let selected = [];
        for (var i = 0; i < this.config.populationSize / 2; i++) {
            selected.push(population[i]);
        }
        return [...population];
    }

    /**
     * Avalia a população
     * @param {[]} population 
     */
    computePopulationFitness(population) {
        // //filters
        // const byDay = (i) => { return i.plan.day === day; };
        // const byIntersectionTime = (i) => { return i.plan.user && i.plan.user.code === individual.plan.user.code && (i.plan.hour >= individual.plan.hour && i.plan.hour + i.plan.task.workload <= individual.plan.hour);};
        // const by = (i) => {
        //                 return i.plan.tool
        //                     && i.plan.tool.code === individual.plan.tool.code
        //                     && (i.plan.hour >= individual.plan.hour && i.plan.hour + i.plan.task.workload <= individual.plan.hour);
        //             };
        // //avalia para cada dia
        // let totalFitness = 0;
        // for (var day = 0; day < this.config.workingDays; day++) {
        //     let daySelection = population.filter(byDay);
        //     for (let individual of daySelection) {
        //         let hourFault = false;
        //         let toolConflict = false;

        //         //Conflito de horario do usuário
        //         if (individual.plan.user) {
        //             let tasksSameHour = population.filter(byIntersectionTime);
        //             hourFault = tasksSameHour.length > 0;
        //         }

        //         //Conflito de ferramenta                
        //         if (individual.plan.tool) {
        //             let toolSameHour = population.filter();
        //             toolConflict = toolSameHour.length > 0;
        //         }

        //         if (hourFault)
        //             individual.fitness += 30;

        //         if (toolConflict)
        //             individual.fitness += 30;

        //         totalFitness += individual.fitness;
        //     }
        // }
        // let sortedPopulation = population.sort((a, b) => { return a.fitness > b.fitness ? 1 : -1; });
        // return { populationFitness: totalFitness, population: sortedPopulation };
    }


    /**
     * inicializa uma populção válida
     * TODO: adicionar recurso para usar estatísticas do passado para melhorar a 
     * inicialização (a cada dia fica mais inteligente)
     * @param {Number} populationSize 
     */
    generateInitialPopulation(populationSize) {
        const resources = this.getResources();

        let population = [];
        let totalHours = this.config.workingDays * this.config.workingHours;

        for (let hour = 0; hour < totalHours; hour++) {
            for (let user of resources.users) {
                const userPlan = this.getValidPlanForUser(user);
                if (!userPlan)
                    break;

                userPlan.adjusteHourByPosition(hour);
                population.push(userPlan);
            }
        }
        const notPlanedTasks = resources.getTasks().filter((t) => {return !t.user;});
        
        for(let task of notPlanedTasks)
            population.push(new Plan(task));

        return population;
    }

    /**
     * Inicializa um indivíduo válido
     * TODO: adicionar recurso para tentar inicializar já com cenários que deram certo no passado.
     */
    getValidPlanForUser(planUser) {
        const resources = this.getResources();
        let tasksToSkip = [];

        if (!planUser)
            return;

        let { planTool, planTask } = getTaskPlan(planUser);


        return new Plan(package, planUser, planTool);

        function getTaskPlan(user) {
            let planTool = null;
            let planTask = null;

            let tasksPerSkill = resources.tasks.filter((t) => {
                return user.skills.indexOf(t.requiredSkill) != -1 //requer a habilidade do usuário
                    && user.getRemaningWorkCapacity() - t.workload > -2 //não sobrecarrega o usuário mais de 2h
                    && tasksToSkip.indexOf(t.code) == -1 //não está atribuido a nenhum usuário
                    ;
            });

            if (tasksPerSkill && tasksPerSkill.length > 0) {
                planTask = tasksPerSkill[0];
            } else {
                let simpleTasks = resources.tasks.filter((t) => {
                    return (!t.requiredSkill || t.requiredSkill == '') //não requer a habilidade do usuário
                        && user.getRemaningWorkCapacity() - t.workload > -2 //não sobrecarrega o usuário mais de 2h
                        && tasksToSkip.indexOf(t.code) == -1 //não está atribuido a nenhum usuário
                        ;
                });
                if (simpleTasks && simpleTasks.length > 0) {
                    planTask = simpleTasks[0];
                }
            }

            if (planTask) {
                user.attachTask(planTask);
                planTask.attachUser(user);

                tasksToSkip.push(planTask.code);

                if (planTask.requiredTool) {
                    for (var i = 0; i < resources.tools.length; i++) {
                        if (planTask.requiredTool === resources.tools[i].type) {
                            planTool = resources.tools[i];
                            resources.tools.splice(i, 1);
                            break;
                        }
                    }
                }
            }
            return { planTool, planTask };
        }

    }
};