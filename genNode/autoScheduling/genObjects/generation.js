const Individual = require("./individual");
const Interval = require("./interval");


/**
 * A classe geração concentra a população (um conjunto de N possibilidades de programção), seu fitness e seu fator de otimização.
 * Existe apenas para agrupar estes interesses de forma separada do processamento principal.
*/
class Generation {
    /**
     * @param {Individual[]} population Lista de programações
     */
    constructor(population) {
        this.population = population;
        this.bestIndividual = null;
        this.fitness = 0.0;
        this.computeFitness();
    }

    /**
     * Find and return the generation fitness
     * For auto scheduling, the generation fitness is the best fitness found in population
     * @returns {float} best fitness in population
    */
    computeFitness() {
        this.fitness = 0;
        this.bestIndividual = null;
        this.population.forEach(individual => {
            this.fitness += individual.computeFitness();
        });

        this.population = this.population.sort((a, b) => {
            if (a.fitness > b.fitness)
                return 1;
            else if (a.fitness === b.fitness && a.allocation < b.allocation)
                return 1;
            return -1;
        });
        this.bestIndividual = this.population[0];
        this.fitness = this.fitness / this.population.length;
        return this.fitness;
    }
}
module.exports = Generation;