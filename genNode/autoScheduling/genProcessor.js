const GenFactory = require("./genFactory");
const ModelLoader = require('./modelLoader');
const Generation = require("./genObjects/generation");
const Individual = require("./genObjects/individual");
const MathHelper = require("../helpers/MathHelper");

const DATA_ORIGIN = { UNKNOW: 0, SCHEDULING: 1 };

class GenProcessor {

    constructor(modelAdapter) {
        this.__curIteration = 0;
        this.__abortSignal = false;
        this.__modelLoader = new ModelLoader(modelAdapter);

        this.config = {
            populationSize: 250,
            maxGenerations: 100,
            elitism: 0.01,
            crossover: 0.7,
            mutation: 0.05
        };
        this.genFactory = new GenFactory(this.config);
        this.sapModel = null;
        this.rouletCache = null;
        this.initialPopulation = null;

        this.dataOrigin = DATA_ORIGIN.UNKNOW;
        this.elit = Math.ceil(this.config.populationSize * this.config.elitism);
        this.onProgress = ({} = {percent: 0, step: ``, message: `not configured`, currentFitness: -1, bestFitness: -1, allocation: -1, generation: -1}) => {};
        this.Log = ({statusCode, statusText}) => {};
    }

    attachOnProgress(onProgressListner) {
        this.onProgress = onProgressListner;
    }
    
    attachLogger(onLoggerListner) {
        this.Log = onLoggerListner;
    }    

    fireOnProgress(step, generation) {
        setImmediate(
            this.onProgress, {
                percent: (step + 1) / this.config.maxGenerations,
                step: `Progress`,
                message: `Current generation: ${step + 1} - best fitness: ${generation.bestIndividual.fitness} [ Allocation: ${generation.bestIndividual.allocation} ]`,
                currentFitness: generation.fitness,
                bestFitness: generation.bestIndividual.fitness,
                allocation: generation.bestIndividual.allocation,
                generation: step + 1
            }
        );
    }

    setupForScheduling(schedulingSapModel) {
        return new Promise((resolve, reject) => {     
            if (this.__abortSignal) return;
            this.sapModel = schedulingSapModel;
            this.dataOrigin = DATA_ORIGIN.SCHEDULING;
            this.Log({ statusCode: 102, statusText: `Building Initial Population` });
            this.genFactory.buildPopulationFromSchedulingModel(this.sapModel, this.onProgress).then(data => {
                this.Log({ statusCode: 102, statusText: `Initial Population Ready` });
                this.initialPopulation = data;
                resolve(this.initialPopulation);
            }).catch(reject);
        });
    }

    abort() {
        this.genFactory.abort();
        this.Log({ statusCode: 499, statusText: `Aborting` });
        this.__abortSignal = true;
    }

    optimise() {
        return new Promise((resolve, reject) => {
            this.__abortSignal = false;
            this.Log({ statusCode: 102, statusText: `Getting Model` });
            this.__modelLoader.getModel().then(model => this.genFactory.buildOptimisedIndividual(model))
                                         .then(data => {
                                             resolve(data);
                                             this.Log({ statusCode: 200, statusText: `Genetic Finished` });
                                         }).catch(err => {
                                             this.Log({ statusCode: 500, statusText: `Error: \n${JSON.stringify(err)}` });
                                         });
        });
    }

    run() {
        return new Promise((resolve, reject) => {
            this.__abortSignal = false;
            this.Log({ statusCode: 102, statusText: `Getting Model` });
            this.__modelLoader.getModel().then(model => this.setupForScheduling(model))
                                         .then(initialPopulation => {
                this.currentGeneration = new Generation(initialPopulation);
                
                this.fireOnProgress(-2, this.currentGeneration);
                
                if (this.currentGeneration.bestIndividual.fitness === 0) {
                    this.fireOnProgress(-1, this.currentGeneration);
                    return this.currentGeneration;
                }        
                this.resolve = resolve;
                this.reject = reject;
                this.Log({ statusCode: 102, statusText: `Starting Genetic` });
                setImmediate(this.__processIteration.bind(this));
            }).catch(err => {
                this.Log({ statusCode: 500, statusText: `Error: \n${JSON.stringify(err)}` });
            });
        });
    }

    __processIteration(){
        if (this.__abortSignal) return;

        let decents = this.makeCrossOver(this.currentGeneration);
        let newPopulation = this.mutate(decents);


        newPopulation.forEach(individual =>
            this.genFactory.shirinkInterval(individual)
        );

        this.currentGeneration = new Generation(newPopulation);

        this.fireOnProgress(this.__curIteration++, this.currentGeneration);

        if (this.__curIteration < this.config.maxGenerations){
            setImmediate(this.__processIteration.bind(this));
        } else {
            this.resolve(this.currentGeneration.bestIndividual);
            this.Log({ statusCode: 200, statusText: `Genetic Finished` });
        }
    }
    /**
     * @param {Generation} generation geração atual
     * @returns {Individual[]} nova população (conjunto de programções)
     */
    makeCrossOver(generation) {
        if (this.__abortSignal) return;
        this.rouletCache = null; //limpa-se o cache da roleta que foi usado na geração anterior

        let decents = [];
        let lastId = 0;
        
        for (let i = 0; i < this.elit; i++) {
            const elitInd = new Individual();
            const toCopy = generation.population[i];
            toCopy.tasksCodes.forEach(taskCode => {
                const task = toCopy.tasks[taskCode];
                for (let userCode of task.users) {
                    const user = toCopy.users[userCode];
                    elitInd.addUserTask(user, task);
                }
            });
            elitInd.id = lastId++;
            decents.push(elitInd);
        }
        
        for (let i = 0; i < generation.population.length - this.elit; i += 2) { // realiza o cruzamento de ordem com os indivíduos restantes
            // let baseDate = new Date(this.genFactory.schedulingInterval.start);
            const parent1 = this.rouletSelection(generation); //escolhe aleatoreamente (por torneio) um indivíduo
            let parent2 = parent1;

            while (parent1.id === parent2.id) {//força não haver cruzamento hermafrodita
                parent2 = this.rouletSelection(generation);
            }

            const codes = [...new Set([...parent1.tasksCodes, ...parent2.tasksCodes])];
            const crossover = codes.length / 2 * this.config.crossover;

            let decent1 = new Individual();
            let decent2 = new Individual();
            decent1.id = lastId++;
            decent2.id = lastId++;

            for (let j = 0; j < crossover; j++) {
                const drawn = MathHelper.getRandomInt(0, codes.length - 1);
                const code = codes.splice(drawn, 1);
                let task1 = parent1.tasks[code];
                let task2 = parent2.tasks[code];
                if (task1) {
                    for (let userCode of task1.users) {
                        const user = parent1.users[userCode];
                        decent2.addUserTask(user, task1);
                    }
                    for (let subtask of task1.subtasks){
                        for (let userCode of subtask.users) {
                            const user = parent1.users[userCode];
                            decent2.addSubTaskUser(user, task1);
                        }
                    }
                }
                if (task2) {
                    for (let userCode of task2.users) {
                        const user = parent2.users[userCode];
                        decent1.addUserTask(user, task2);
                    }
                    for (let subtask of task2.subtasks){
                        for (let userCode of subtask.users) {
                            const user = parent2.users[userCode];
                            decent1.addSubTaskUser(user, task2);
                        }
                    }
                }
            }

            for (let j = 0; j < parent1.tasksCodes.length; j++) {
                const taskCode = parent1.tasksCodes[j];
                if (!decent1.tasks[taskCode]) {
                    let task = parent1.tasks[taskCode];
                    for (let userCode of task.users) {
                        const user = parent1.users[userCode];
                        decent1.addUserTask(user, task);
                    }
                    for (let subtask of task.subtasks){
                        for (let userCode of subtask.users) {
                            const user = parent1.users[userCode];
                            decent1.addSubTaskUser(user, task);
                        }
                    }                    
                }
            }

            for (let j = 0; j < parent2.tasksCodes.length; j++) {
                const taskCode = parent2.tasksCodes[j];
                if (!decent2.tasks[taskCode]) {
                    let task = parent2.tasks[taskCode];
                    for (let userCode of task.users) {
                        const user = parent2.users[userCode];
                        decent2.addUserTask(user, task);
                    }
                    for (let subtask of task.subtasks){
                        for (let userCode of subtask.users) {
                            const user = parent2.users[userCode];
                            decent2.addSubTaskUser(user, task);
                        }
                    }                    
                }
            }


            decents.push(decent1);
            decents.push(decent2);
        }

        return decents;
    }

    /**
     * Seleção por toneio - mais ápto com maior chance
     * @param {Generation} generation geração atual
     * @returns {Individual} indivíduo selecionado
     */
    rouletSelection(generation) {
        if (!this.rouletCache) { //usa a mesma roleta durante toda uma geração
            //criar uma nova roleta. a roleta possui a posição do item a ser sorteado e a possibilidade dele ser sorteado, sendo que quanto mais bem apto, maior a probabilidade do indivíduo.
            this.rouletCache = generation.population.map((scheduling, i) => {
                //A probabilidade é gerada por um fator do percentual de contribuição do fitness individual do individuo em relação ao fitness da geração multiplicado pelo dobro do inverso da sua posição ordenada em relação a sua aptidão.
                //quanto mais ao topo (perto de zero), maior a probabilidade de ser sorteado - zero é o indivíduo com melhor aptidão
                //p = ([f(g) / f(i)] * 100) * ((l(g)-r(i))^2) -> f(x):fitness | l(x):length | r(x):rank | g:generation | i:individual
                return { index: i, probability: generation.fitness / scheduling.fitness * 100 * Math.pow(generation.population.length - i, 2) };
            }).sort((a, b) => {
                return a.probability > b.probability ? 1 : -1; //ordena do menor para o maior
            });
        }

        const drawnNumber = MathHelper.getRandomInt(0, this.rouletCache[this.rouletCache.length - 1].probability); //sorteia um numero da roleta
        const selected = this.rouletCache.find((value) => { return value.probability >= drawnNumber; }); //encontra o primeiro item com probabilidade maior ou igual a atual
        return generation.population[selected.index]; //retorna o item sorteado
    }

    /**
     * Realiza a mutação alterando quando uma ordem será executada ou sua alocação
     * @param {Individual[]} decents população - conjunto de N possibilidades de programação
     * @returns {Individual[]} população mutada
     */
    mutate(decents) {
        if (this.__abortSignal) return;
        for (let individual of decents) {
            const drawn = MathHelper.getRandomInt(0, 100);

            if (drawn >= this.config.mutation * 100) {
                continue; //faz mutação toda vez que um valor menos que o fator de mutação for sorteado
            }

            const mutatePosition = MathHelper.getRandomInt(0, 10000) % 7 === 0; //escolhe se vai mudar a posição (e manter a alocação) ou uma alocação (e manter a posição) | posição = uma data/hora

            if (mutatePosition) {
                this.mutateStartDate(individual);
            } else {
                this.mutateUser(individual);
            }
        }
        return decents;
    }

    /**
     * Troca a hora que irá realizar a operação
     * @param {Individual} individual uma programação (conjunto de operações)
     */
    mutateStartDate(individual) {
        for (let taskCode of individual.tasksCodes) {
            const task = individual.tasks[taskCode];

            if (task.hasDateRestriction) {
                continue;
            }
            const minutes = MathHelper.getRandomInt(-2880, 2880);
            task.interval.start.setMinutes(task.interval.start.getMinutes() + minutes);
            task.interval.end.setMinutes(task.interval.end.getMinutes() + minutes);
        }
    }

    /**
     * Troca o usuário que irá realizar a operação
     * @param {Individual} individual uma programação (conjunto de operações)
     */
    mutateUser(individual) {

        let i = 0;
        let taskCode = null;
        let j = 0;
        let max = 100;
        do {
            i = MathHelper.getRandomInt(0, individual.tasksCodes.length - 1);
            taskCode = individual.tasksCodes[i];
            j++;
        } while (j < max && !individual.tasks[taskCode].users.length); //procura uma programação que tenha usuário alocado

        if (!individual.tasks[taskCode].users.length) return;

        const usersCode = individual.tasks[taskCode].users.concat(this.genFactory.usersCodes.filter(u => !individual.users[u]));
        const drawn = MathHelper.getRandomInt(0, usersCode.length - 1);
        const userToSwap = individual.users[usersCode[drawn]] || this.genFactory.users[usersCode[drawn]];
        let allocatedUserTasksCode = userToSwap.tasks.map(task => task.code); //lista de codigos de tarefas alocadas para o usuário
        let possibleTasks = this.genFactory.getTasksByWorkcenter(userToSwap.workcenter, allocatedUserTasksCode) || []; //lista todas as tarefas que podem ser realizadas pelo usuário, exceto as já alocadas para o usuário (mesmo se estiver com outro usuário)
        // possibleTasks = individual.tasksCodes.filter(taskCode => possibleTasks.indexOf(pt => pt.code === taskCode) !== -1); //&& (!individual.tasks[taskCode].users.length || individual.tasks[taskCode].users.length < individual.tasks[taskCode].personsRequired));

        if (possibleTasks.length > 0) {
            const taskIndex = MathHelper.getRandomInt(0, possibleTasks.length - 1); //pega aleatoreamente uma tarefa compatível com o usuário

            const taskDest = individual.tasks[possibleTasks[taskIndex]]; //encontra quem era o dono desta trafa antes para remover a associação anterior
            if (taskDest) {
                const idx = userToSwap.tasks.findIndex(usertask => usertask.code === taskCode);
                if (idx !== -1) {
                    userToSwap.tasks.splice(idx, 1);
                }
                if (taskDest.users.length >= taskDest.personsRequired) {
                    const ucode = taskDest.users.splice(0, 1);
                    const removedUser = individual.users[ucode];
                    removedUser.detachTask(taskDest);
                    if (!removedUser.tasks.length) {
                        individual.removeUser(removedUser);
                    }
                }
                individual.addUserTask(userToSwap, taskDest);
            }
        }
    }
}
module.exports = GenProcessor;
// sap.ui.define(() => { return GenProcessor; });