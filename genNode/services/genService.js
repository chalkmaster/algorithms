const GeneticFactory = require('../geneticFactory');
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
            populationSize: 5,
            maxGenerations: 100,
            elitism: 0.2,
            crossover: 0.3,
            mutation: 0.03,
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

            /*FIX: só pra ajudar a testar, vou armazenar só o fitness por enquanto
             * na vesão nem precisa do snapshot se não quiser
             * */
            //this.reduce(previousGeneration).then((g) => generationsSnapshot.push(g));
            generationsSnapshot.push(previousGeneration.fitness);

            if (currentPopulationFitness == 0)
                break;
        }


        return generationsSnapshot;
    }

    /**
     * 
     * @param {Generation} generation 
     */
    reduce(generation) {
        return new Promise((resolve, reject) => {
            for (let planning of generation.population) {
                for (let plan of planning.planList) {
                    if (plan.user)
                        plan.user = plan.user.code;
                    if (plan.tool)
                        plan.tool = plan.tool.code;
                    if (plan.task)
                        plan.task = plan.task.code;
                }
            }
            resolve(generation);
        });
    }

    getInitialPopulation() {
        let population = [];
        for (let i = 0; i < this.config.populationSize; i++) {
            population.push(this.geneticFactory.buildPlanning());
        }
        return population.sort((a, b) => { return a.fitness < b.fitness ? 1 : -1; });
    }

    /**
     * 
     * @param {Generation} generation 
     */
    makeCrossOver(generation) {
        let decents = [];
        const elit = this.config.populationSize * this.config.elitism;
        const crossover = this.config.populationSize * this.config.crossover;

        for (let i = 0; i < elit; i++)
            decents.push(generation.population[i]);

        for (let i = 0; i < this.config.populationSize - elit; i += 2) {
            let p1 = this.rouletSelection(generation);
            let p2 = this.rouletSelection(generation); //FIX: Melhorar colocando pra não cruzar com ele mesmo, pra isso precisa colocar um ID no planejamento
            let f1 = Array(this.config.populationSize);
            let f2 = Array(this.config.populationSize);
            let pattern = [];

            //FIX: da pra reduzir o numero de for
            for (let j = 0; j < this.config.populationSize; j++)
                pattern.push(0);

            for (let j = 0; j < crossover; j++) {
                let draw = mathHelper.getRandomInt(0, this.config.populationSize - 1);
                pattern[draw] = 1;
            }

            for (let j = 0; j < this.config.populationSize; j++) {
                if (pattern[j] == 0) continue;

                f1[j] = p2.planList[j];
                f2[j] = p1.planList[j];
            }

            for (let j = 0; j < this.config.populationSize; j++) {
                if (pattern[j] == 1) continue;

                let index = 0;

                while (f1.findIndex((p) => { return p.code == p1[index].code; }) != -1)
                    index++;

                f1[j] = p1[index];

                index = 0;

                while (f1.findIndex((p) => { return p.code == p2[index].code; }) != -1)
                    index++;

                f2[j] = p2[index];
            }

            let decent1 = new Planning(f1.sort((a, b) => { return a.fitness < b.fitness ? 1 : -1; }));
            let decent2 = new Planning(f2.sort((a, b) => { return a.fitness < b.fitness ? 1 : -1; }));

            decent1.computeFitness();
            decent2.computeFitness();

            decents.push(decent1);
            decents.push(decent2);
        }
    }

    /**
     * seleciona um individuo usando estratégia de roleta
     * @param {Generation} generation 
     * @returns {Planning}
     */
    rouletSelection(generation) {
        let roulet = generation.population.map((p, i) => { return { index: i, probability: p.fitness / generation.fitness }; })
            .sort((a, b) => { return a.probability > b.probability ? 1 : -1; });

        roulet.forEach((value, index) => {
            value.probability *= index * 100;
        });

        let drawNumber = mathHelper.getRandomInt(0, roulet[roulet.length - 1].probability);
        let selected = roulet.find((value) => { return value.probability > drawNumber; });
        return generation.population[selected.index];
    }

    /**
     * 
     * @param {Planning[]} population 
     */
    mutate(population) {
        for (let planning of population) {
            let draw = mathHelper.getRandom();
            if (draw < this.config.mutation) {
                let pos1 = mathHelper.getRandomInt(0, this.config.populationSize -1);
                let pos2 = 0;
                do{
                    pos2 = mathHelper.getRandomInt(0, this.config.populationSize -1);
                } while (pos1 == pos2);

                let temp = planning.planList[pos1];
                planning.planList[pos1] = planning.planList[pos2];
                planning.planList[pos2] = temp;
                planning.computeFitness();
            }
        }
        return population;
    }
};