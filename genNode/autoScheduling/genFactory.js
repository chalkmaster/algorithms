const Task = require('./genObjects/task');
const User = require("./genObjects/user");
const Individual = require("./genObjects/individual");
const Interval = require("./genObjects/interval");
const Disponibility = require("./genObjects/disponibility");
const TechnicalObjects = require("./genObjects/technicalObject");
const DateHelper = require('../helpers/DateHelper');
const MathHelper = require('../helpers/MathHelper');

class GenFactory {
    constructor(config) {
        this.__curIteration = 0;
        this.__abortSignal = false;

        this.config = config;
        this.schedulingInterval = new Interval();
        this.tasks = {};
        this.users = {};
        this.tasksCodes = [];
        this.usersCodes = [];
        this.technicalObjects = [];
        this.schedulingAlloctionCalendar = new Disponibility();
        this.fireOnProgress = ({} = {percent: 0, step: ``, message: `not configured`, currentFitness: -1, bestFitness: -1, allocation: -1, generation: -1}) => {};
    }

    /**
     * @param {{start: Date, end: Date, users: {}, usersCodes: [], tasks: {}, tasksCodes: [], technicalObjects: []}} genModel
     */
    loadResources(genModel) {
        this.clear();
        this.users = genModel.users;
        this.tasks = genModel.tasks;
        this.usersCodes = genModel.usersCodes;
        this.tasksCodes = genModel.tasksCodes;
        this.technicalObjects = genModel.technicalObjects;
        this.schedulingInterval = new Interval(genModel.start, genModel.end);
    }

    abort(){
        this.__abortSignal = true;
    }
    
    /**
     * Clear all internal and control variables
     */
    clear(){
        this.__curIteration = 0;
        this.__abortSignal = false;
        this.tasks = {};
        this.users = {};
        this.tasksCodes = [];
        this.usersCodes = [];
        this.technicalObjects = [];        
    }

    buildPopulationFromSchedulingModel(model, onProgressEventListner = ({} = {percent: 0, step: ``, message: `not configured`, currentFitness: -1, bestFitness: -1, allocation: -1, generation: -1}) => {}) {
        this.fireOnProgress = onProgressEventListner;

        return new Promise((resolve, reject) => {
            this.__population = [];
            this.resolve = resolve;
            this.reject = reject;

            this.loadResources(model);

            setImmediate(this.buildIndividual.bind(this));
        });
    }
    
    /**
     * Builds an individual for the current dataset
     * Este método foi criado separado para facilitar a quebra da execução
     */
    buildIndividual(){
        if (this.__abortSignal) return;
        //Pega a lista original, faz um shuffle clonando os elementos pra poder gerar a população;
        const randonOrderedUsers = this.usersCodes.map(userCode => [Math.random(), this.users[userCode].original()]).sort((a, b) => a[0] > b[0] ? 1 : -1).map(a => a[1]);
        const randonOrderedTasks = this.tasksCodes.map(taskCode => [Math.random(), this.tasks[taskCode].original()]).sort((a, b) => a[0] > b[0] ? 1 : -1).map(a => a[1]);

        const individual = new Individual();
        individual.id = this.__curIteration;

        randonOrderedTasks.forEach(task => {
            //Para cada tarefa ordenada, ele encontra um usuário válido para fazer a primeira alocação.
            this.attachInitialUsers(randonOrderedUsers, task, individual);
            task.subtasks.forEach(subTask => this.attachInitialSubTaskUsers(randonOrderedUsers, subTask, individual));
        });

        //individual.computeFitness();
        this.shirinkInterval(individual);

        //Envia a informação de progresso para o cliente que disparou o algorítmo.
        this.fireOnProgress({
            percent: this.__curIteration / this.config.populationSize,
            step: `Building Population`,
            message: `No fitness or allocation are processed this time.`,
            currentFitness: -1, bestFitness: -1, allocation: -1, generation: this.__curIteration
        });

        this.__population.push(individual);

        if (this.__curIteration++ < this.config.populationSize){
            setImmediate(this.buildIndividual.bind(this));
        } else {
            this.resolve(this.__population);
        }
    }

    /**
     * Builds an individual for the current dataset
     * Este método foi criado separado para facilitar a quebra da execução
     */
    buildOptimisedIndividual(model){
        return new Promise((resolve, reject) => {
            if (this.__abortSignal) return;

            this.loadResources(model);
            const users = this.usersCodes.map(userCode => this.users[userCode]);
            const pairs = this.tasksCodes.map(taskCode => this.tasks[taskCode])
                                         .reduce((arr, cur) => {
                                            let pair = arr.find(p => p.priority === cur.priority);
                                            if (pair){
                                                pair.tasks.push(cur);
                                            } else {
                                                arr.push({priority: cur.priority, tasks: [cur]});
                                            }
                                            return arr;
                                         }, [])
                                         .sort((a,b) => a.priority > b.priority ? 1 : -1);

            const optimisedIndividual = new Individual();            
            let usersCache = [];
            //TODO: Usuários adicionais
            //TODO: Manter a data do planejamento
            for (let k = 0; k < pairs.length; k++){
                const individual = new Individual();
                const tasks = pairs[k].tasks;

                const stopMachineTasks = tasks.filter(task => task.requiredStoppedCondition && task.technicalObjectKey);
                for (let s = 0; s < stopMachineTasks.length; s++){
                    const task = stopMachineTasks[s];
                    const to = this.technicalObjects.find(t => task.technicalObjectKey === t.key);
                    if (to){
                        if (to.workingCalendar.daysOff.length){
                            const startDate = to.workingCalendar.daysOff.find(d => d.start > this.schedulingInterval.start && d.start < this.schedulingInterval.end);
                            if (startDate){
                                task.interval.start = new Date(startDate);
                                task.hasDateRestriction = true;
                            }
                        }
                    }
                }

                const possibleUsers = users.filter(user => tasks.some(task => user.hasAffinity(task)));

                let task = null;
                let tasksCache = [];

                for (let u = 0; u < possibleUsers.length; u++){
                    if (this.__abortSignal) return;
                    const user = possibleUsers[u];
                    task = tasks.filter(task => tasksCache.indexOf(task.code) === -1).sort((a, b) => user.getRankingByTask(a) < user.getRankingByTask(b) ?  1 : -1)[0]
                    if (!task) continue;
                    individual.addUserTask(user, task);
                    tasksCache.push(task.code);
                    if (task.personsRequired > 1){
                        for (let p = 0; p < task.personsRequired; p++){
                            individual.addUserTask(this.getBestUserFor(possibleUsers, task), task);
                        }
                    }
                    if (task.subtasks.length){
                        for (let st = 0; st < task.subtasks.length; st++){
                            const subtask = task.subtasks[st];
                            individual.addSubTaskUser(this.getBestUserFor(possibleUsers, subtask), task);
                        }
                    }
                }

                this.fitTasks(individual);
                                
                individual.tasksCodes.map(code => individual.tasks[code]).forEach(task => {
                    task.users.map(code => individual.users[code]).forEach(user => {
                        optimisedIndividual.addUserTask(user, task);
                    });
                });
            }            

            optimisedIndividual.computeFitness();

            resolve(optimisedIndividual);
        });
    }

    /**
     * @param {User[]} randonOrderedUsers 
     * @param {Task} task 
     * @param {Individual} individual 
     */
    attachInitialUsers(randonOrderedUsers, task, individual) {
        if (this.__abortSignal) return;
        for (let i = 0; i < task.personsRequired; i++) {
            let user = this.getRandomUserFor(randonOrderedUsers, task);
            if (user) {
                individual.addUserTask(user, task);
                user.attachTask(task); //apenas controle pra geração da população inicial, depois é descartado. Não afeta o calculo de disponibilidade do usuário no indivíduo
                task.attachUser(user); //o mesmo para task
            } else {
                individual.addTaskWithoutUser(task);
            }
        }
    }

     /**
     * @param {User[]} randonOrderedUsers 
     * @param {Task} task 
     * @param {Individual} individual 
     */
    attachInitialSubTaskUsers(randonOrderedUsers, task, individual) {
        if (this.__abortSignal) return;
        for (let i = 0; i < task.personsRequired; i++) {
            let user = this.getRandomUserFor(randonOrderedUsers, task);
            if (user) {
                individual.addSubTaskUser(user, task);
                user.attachTask(task); //apenas controle pra geração da população inicial, depois é descartado. Não afeta o calculo de disponibilidade do usuário no indivíduo
                task.attachUser(user); //o mesmo para task
            }
        }
    }

    /**
     * @param {User[]} users 
     * @param {Task} task 
     */
    attachBestUser(users, task, individual) {
        if (this.__abortSignal) return;
        if (task.users.length >= task.personsRequired) return;
        for (let i = 0; i < task.personsRequired; i++) {
            let user = this.getBestUserFor(users, task);
            if (user) {
                if (individual && individual.addUserTask) individual.addUserTask(user, task);
                user.attachTask(task); //apenas controle pra geração da população inicial, depois é descartado. Não afeta o calculo de disponibilidade do usuário no indivíduo
                task.attachUser(user); //o mesmo para task
            }
        }
    }

    /**
     * @param {User[]} users 
     * @param {Task} task 
     */
    getRandomUserFor(users, task) {
        const possibleUsers = users.filter(user => user.hasAffinity(task) && user.tasks.indexOf(task.code) === -1 && user.remaningCapacity > task.totalDuration);
        const drawn = MathHelper.getRandomInt(0, possibleUsers.length - 1);
        return possibleUsers[drawn];
    }

    /**
     * @param {User[]} users 
     * @param {Task} task 
     */
    getBestUserFor(users, task) {
        return users.filter(user => user.hasAffinity(task)).sort((a,b) => a.getRankingByTask(task) < b.getRankingByTask(task) ? 1 : -1)[0];
    }

    /**
     * @param {Individual} individual
     * @param {Task[]} tasks
     */
    recalculateLinearInterval(individual, tasks, userCode) {
        if (this.__abortSignal) return;
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            let lastTask = task;

            //se uma operação possui restrição de data e já está programada (não está no backlog nem no futuro distante) ele mentem ele onde está
            if (task.hasDateRestriction && task.interval.inConflicInterval(this.schedulingInterval)) {
                continue;
            }

            if (i === 0) { //a primeira operação começa na primeira hora do projeto
                task.interval.start = new Date(this.schedulingInterval.start);
            } else {
                lastTask = tasks[i - 1]; //a ordem inica logo apos a anterior
                task.interval.start = new Date(lastTask.interval.end);
            }
            
            if (task.interval.start > this.schedulingInterval.end){
                individual.detachUserTask(individual.users[userCode], task);
                continue;
            }

            //tenta encontrar um horário com pessoa trabalhando
            this.adjustStart(individual, task, userCode);
            this.adjustEnd(individual, task, userCode);
        }
    }

    /**
     * @param {Individual} individual
     * @param {Task} task 
     */
    adjustStart(individual, task, userCode) {
        if (this.__abortSignal) return;
        if(!userCode) return;

        let userCapacity = individual.users[userCode].capacity.getByDate(task.interval.start);
        let i = 0;
        let max = this.schedulingInterval.getDurationInDays();
        while (i <= max && task.interval.start < this.schedulingInterval.end && (!userCapacity || !userCapacity.nextStart)) {
            i++;
            task.interval.start.setDate(task.interval.start.getDate() +1);
            userCapacity = individual.users[userCode].capacity.getByDate(task.interval.start);
            if (this.__abortSignal) return;
        }

        if (!userCapacity || !userCapacity.nextStart || task.interval.start >= this.schedulingInterval.end){
            individual.detachUserTask(individual.users[userCode], task);
            return;
        } 

        task.interval.start = new Date(userCapacity.nextStart);
    }

    /**
     * @param {Individual} individual
     * @param {Task} task 
     */
    adjustEnd(individual, task, userCode) { 
        if (this.__abortSignal) return;     
        if(!userCode) return;

        let dateKey = new Date(task.interval.start);
        let userCapacity = individual.users[userCode].capacity.getByDate(dateKey);
        let max = this.schedulingInterval.getDurationInDays();

        if (!userCapacity || !userCapacity.nextStart) return;

        let duration = task.totalDuration;
        let maxWI = duration / 60;
        let wi = 0;
        while (wi < maxWI && duration > 0) {
            wi++;
            if (this.__abortSignal) return;
            if (duration <= userCapacity.available){                
                userCapacity.available -= duration;
                task.interval.end = new Date(userCapacity.nextStart);
                task.interval.end.setMinutes(task.interval.end.getMinutes() + duration);
                userCapacity.nextStart = new Date(task.interval.end);
                userCapacity.nextStart.setMinutes(userCapacity.nextStart.getMinutes() + 1);
                duration = 0;
            } else {
                if (userCapacity.available > 0){
                    duration -= userCapacity.available;
                    task.interval.end = new Date(userCapacity.nextStart);
                    task.interval.end.setMinutes(task.interval.end.getMinutes() + userCapacity.available);
                    userCapacity.available = 0;
                    userCapacity.nextStart = null;
                }
                let i = 0;
                do {
                    i++;
                    dateKey.setDate(dateKey.getDate() + 1);
                    userCapacity = individual.users[userCode].capacity.getByDate(dateKey);
                    if (this.__abortSignal) return;
                } while(i < max && (!userCapacity || !userCapacity.nextStart) && task.interval.end < this.schedulingInterval.end);
                if (!userCapacity || !userCapacity.nextStart || task.interval.end > this.schedulingInterval.end) return;
            }

            for(let code of task.users){
                if (code === userCode) continue;
                let sub = individual.users[code].capacity.dayCapacity[userCapacity.key];
                if (sub) {
                    sub.available -= duration;
                }
                if (this.__abortSignal) return;                
            }
        }
    }

    /**
     * @param {Individual} individual
     */
    shirinkInterval(individual) {
        if (this.__abortSignal) return;
        let processedTasksCode = [];

        individual.usersCodes.forEach(userCode => {
            if (this.__abortSignal) return;
            const validTasksCodes = individual.users[userCode].tasks.filter(taskcode => processedTasksCode.indexOf(taskcode) === -1 && individual.tasks[taskcode]);
            processedTasksCode = [...processedTasksCode, ...validTasksCodes];
            const tasks = validTasksCodes.map(taskcode => individual.tasks[taskcode]).sort((a, b) => a.interval.start > b.interval.start ? 1 : -1);
            individual.users[userCode].capacity.reset();
            this.recalculateLinearInterval(individual, tasks, userCode);
        });
    }

    /**
     * @param {Individual} individual
     */
    fitTasks(individual) {
        if (this.__abortSignal) return;
        let processedTasksCode = [];

        individual.usersCodes.forEach(userCode => {
            if (this.__abortSignal) return;
            const validTasksCodes = individual.users[userCode].tasks.filter(taskcode => processedTasksCode.indexOf(taskcode) === -1 && individual.tasks[taskcode]);
            processedTasksCode = [...processedTasksCode, ...validTasksCodes];
            const tasks = validTasksCodes.map(taskcode => individual.tasks[taskcode]);            
            this.recalculateLinearInterval(individual, tasks, userCode);
        });
    }

    getTasksByWorkcenter(workcenter, toIgnore = []) {
        return this.tasksCodes.filter(taskCode => workcenter.indexOf(this.tasks[taskCode].workcenter) !== -1  && toIgnore.indexOf(taskCode) === -1);
    }
}
module.exports = GenFactory;