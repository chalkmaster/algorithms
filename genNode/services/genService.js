const GeneticFactory = require('../geneticFactory');
const Planning = require('../domainObjects/planning');

class Generation {
    /**
     * 
     * @param {Planning[]} population
     */
    constructor(population){
        this.population = population;
        this.fitness = 0;
        this.computeFitness();
    }
    computeFitness(){
        let totalFitness = 0;
        for(let planning of this.population)
            totalFitness += planning.fitness;
        this.fitness = totalFitness;
        return this.fitness;
    }
}

module.exports = class genService {
    constructor() {
        this.config = {
            workingDays: 7,
            workingHours: 8,            
            populationSize: 100,
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

        let generationsSnapshot = [currentGeneration];

        if (currentGeneration.fitness == 0)
            return generationsSnapshot;

        for (let i = 0; i < this.config.maxGenerations; i++) {

            let decents = this.makeCrossOver(currentGeneration.population);
            let newPopulation = this.mutate(decents);
            
            previousGeneration = currentGeneration;
            currentGeneration = new Generation(newPopulation);
            
            generationsSnapshot.push(currentGeneration);
            if (currentPopulationFitness == 0)
                break;
        }


        return generationsSnapshot;
    }

    getInitialPopulation(){
        let population = [];
        for(let i = 0; i < this.config.populationSize; i++){
            population.push(this.geneticFactory.buildPlanning());
        }
        return population;
    }

    /**
     * 
     * @param {Planning[]} population 
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
     * @param {Planning[]} population 
     */
    mutate(population){

    }
};