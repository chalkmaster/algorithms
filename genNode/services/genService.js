const GeneticFactory = require('../geneticFactory');
const resourcesService = require('../services/resourceService');
const Planning = require('../domainObjects/planning');
const mathHelper = require('../helpers/mathHelper');

class Generation {
    /**
     * 
     * @param {Planning[]} population
     */
    constructor(population) {
        this.population = population;
        this.fitness = 0;
        this.computeFitness();
    }
    computeFitness() {
        let totalFitness = 0;
        for (let planning of this.population)
            totalFitness += planning.fitness;
        this.fitness = totalFitness;
        return this.fitness;
    }
}

module.exports = class genService {
    constructor() {
        this.config = {
            workingDays: 3,
            workingHours: 8,
            populationSize: 10,
            maxGenerations: 100,
            elitism: 0.1,
            crossover: 0.7,
            mutation: 0.01,
        };
        this.geneticFactory = new GeneticFactory(this.config);
    }

    run() {
        let currentGeneration = new Generation(this.getInitialPopulation());
        let previousGeneration = currentGeneration;

        let generationsSnapshot = [];

        if (currentGeneration.fitness == 0)
            return generationsSnapshot;

        for (let i = 0; i < this.config.maxGenerations; i++) {

            let decents = this.makeCrossOver(currentGeneration);
            let newPopulation = this.mutate(decents);

            previousGeneration = currentGeneration;
            currentGeneration = new Generation(newPopulation);

            generationsSnapshot.push(previousGeneration.fitness);

            if (currentGeneration.fitness == 0)
                break;
        }


        return generationsSnapshot;
    }

    getInitialPopulation() {
        let population = [];
        for (let i = 0; i < this.config.populationSize; i++) {
            let planning = this.geneticFactory.buildPlanning();
            planning.id = i;
            population.push(planning);
        }
        return population.sort((a, b) => { return a.fitness < b.fitness ? 1 : -1; });
    }

    /**
     * 
     * @param {Generation} generation 
     */
    makeCrossOver(generation) {
        let decents = [];

        const elit = Math.ceil(this.config.populationSize * this.config.elitism);

        for (let i = 0; i < elit; i++) {
            generation.population[i].id = i;
            decents.push(generation.population[i]);
        }

        for (let i = 0; i < this.config.populationSize - elit; i += 2) {
            const p1 = this.rouletSelection(generation);
            let p2 = p1;

            while (p1.id == p2.id)
                p2 = this.rouletSelection(generation);

            const planSize = p1.planList.length;
            const crossover = planSize * this.config.crossover;

            let f1 = Array(planSize);
            let f2 = Array(planSize);
            let pattern = [];

            for (let j = 0; j < crossover; j++) {
                let drawn = mathHelper.getRandomInt(0, planSize - 1);
                pattern[drawn] = 1;
            }

            for (let j = 0; j < planSize; j++) {
                if (pattern[j] == 1) {
                    f1[j] = p2.planList[j];
                    f2[j] = p1.planList[j];
                    continue;
                }

                let index = 0;

                while (index < planSize - 1 && f1.findIndex((p) => { return p && p1.planList[index] && p.id == p1.planList[index].id; }) != -1)
                    index++;

                f1[j] = p1.planList[index];

                index = 0;

                while (index < planSize - 1 && f2.findIndex((p) => { return p && p2.planList[index] && p.id == p2.planList[index].id; }) != -1)
                    index++;

                f2[j] = p2.planList[index];
            }

            let decent1 = new Planning(f1);
            let decent2 = new Planning(f2);

            decent1.id = i + decents.length;
            decent2.id = decent1.id + 1;

            decent1.computeFitness(this.config);
            decent2.computeFitness(this.config);            

            decents.push(decent1);
            decents.push(decent2);
        }
        this.adjustTime(decents);
        return decents;
    }

    /**
     * seleciona um individuo usando estratégia de roleta
     * @param {Generation} generation 
     * @returns {Planning}
     */
    rouletSelection(generation) {
        let roulet = generation.population.map((p, i) => { return { index: i, probability: p.fitness / generation.fitness }; })
            .sort((a, b) => { return a.probability > b.probability ? 1 : -1; });

        roulet.splice(0, roulet.length * 0.6);

        roulet.forEach((value, index) => {
            value.probability = Math.ceil(value.probability * 100);
            value.probability += value.probability * (index * index);
        });

        const drawnNumber = mathHelper.getRandomInt(0, roulet[roulet.length - 1].probability - 1);
        const selected = roulet.find((value) => { return value.probability >= drawnNumber; });
        return generation.population[selected.index];
    }

    /**
     * 
     * @param {Planning[]} population 
     */
    mutate(population) {
        for (let planning of population) {
            const drawn = mathHelper.getRandom();

            if (this.config.mutation < drawn) continue;

            const positionOrData = mathHelper.getRandomInt(0, 9) % 2;

            if (positionOrData == 1)
                this.mutatePosition(planning);
            else
                this.mutateData(planning);

            planning.computeFitness();
        }
        return population.sort((a, b) => { return a.fitness < b.fitness ? 1 : -1; });
    }

    /**
     * 
     * @param {Planning} planning 
     */
    mutatePosition(planning) {
        let pos1 = 0;
        let pos2 = pos1;

        do {
            pos1 = mathHelper.getRandomInt(0, planning.planList.length - 1);
        } while (!planning.planList[pos1] || !planning.planList[pos1].user || !planning.planList[pos1].task);

        do {
            pos2 = mathHelper.getRandomInt(0, planning.planList.length - 1);
        } while (!planning.planList[pos2] || pos2 == pos1 || (planning.planList[pos2].user && planning.planList[pos2].user.code != planning.planList[pos1].user.code));

        let temp = planning.planList[pos1];
        planning.planList[pos1] = planning.planList[pos2];
        planning.planList[pos2] = temp;
        //planning.adjustStartHourForAllPlans();
    }

    /**
     * 
     * @param {Planning} planning 
     */
    mutateData(planning) {

        const resources = new resourcesService();
        const toolOrTask = mathHelper.getRandomInt(0, 9) % 2;

        let planIndex = 0;
        do {
            planIndex = mathHelper.getRandomInt(0, planning.planList.length - 1);
        } while (!planning.planList[planIndex]);

        while (!planning.planList[planIndex] || !planning.planList[planIndex].user)
            planIndex = mathHelper.getRandomInt(0, planning.planList.length - 1);

        const plannedTasks = planning.planList[planIndex].user.tasks.map((val) => { return { code: val.code }; });

        const possibleTasks = resources.getTasksByUserSkills(planning.planList[planIndex].user, plannedTasks)
            .concat(resources.getTasksWithoutRequiredSkill(plannedTasks));

        if (possibleTasks && possibleTasks.length > 0) {
            const taskIndex = mathHelper.getRandomInt(0, possibleTasks.length - 1);

            const toClear = planning.planList.find((plan) => { return plan && plan.task && plan.task.code == possibleTasks[taskIndex].code; });
            if (toClear && toClear.user) {
                const idx = toClear.user.tasks.findIndex((task) => { return task.code == toClear.task.code; });
                toClear.user.tasks.splice(idx, 1);
                toClear.task.user = null;
                toClear.task = null;
                toClear.computeFitness(this.config);
            }

            planning.planList[planIndex].task = possibleTasks[taskIndex];
            if (planning.planList[planIndex].user.tasks && planning.planList[planIndex].user.tasks.length > 0) {
                planning.planList[planIndex].user.tasks[0].user = null;
                planning.planList[planIndex].user.tasks.shift();
            }
            planning.planList[planIndex].user.attachTask(planning.planList[planIndex].task);
            planning.planList[planIndex].task.attachUser(planning.planList[planIndex].user);
            planning.planList[planIndex].computeFitness(this.config);
        }
    }

    /**
     * 
     * @param {Planning[]} population 
     */
    adjustTime(population) {
        let totalHours = this.config.workingDays * this.config.workingHours;
        for (let planning of population) {
            let control = [];
            for (let plan of planning.planList) {
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
    }
};