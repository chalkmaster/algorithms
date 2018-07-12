const Task = require('./task');
const User = require("./user");

/**
 * A classe indivíduo representa uma programação possível gerada pelo sistema, contemplando todas as operações distribuídas pelo algoritimo
*/
class Individual {
    /**
     * @param {Task[]} tasks cada cromossomo é uma operação na programação, as composições são seus genes (Allocalçao, MAPs)
     * @param {User[]} users
     */
    constructor(tasks = {}, users = {}) {
        this.id = 0;
        this.tasks = {};
        this.users = {};
        this.tasksCodes = [];
        this.usersCodes = [];
        this.fitness = 0;
        this.allocation = 0;
        this.taskTrash = [];
    }

    clone(){
        const clone = new Individual();
        clone.tasksCodes = [...this.tasksCodes];
        clone.usersCodes = [...this.usersCodes];
        clone.taskTrash = this.taskTrash.map(task => task.original());

        const tasks = this.tasksCodes.map(code => this.tasks[code].clone());
        const users = this.usersCodes.map(code => this.users[code].clone());        
        tasks.forEach(task => {
            clone.tasks[task.code] = task;
        });
        users.forEach(user => {
            clone.users[user.code] = user;
        });
        return clone;
    }

    /**
     * @param {User} user 
     * @param {Task} task 
     */
    addUserTask(user, task) {
        if (!this.users[user.code]) {
            this.users[user.code] = user.original();
            this.usersCodes.push(user.code);
        }
        if (!this.tasks[task.code]) {
            this.tasks[task.code] = task.original();
            this.tasksCodes.push(task.code);
        }
        this.users[user.code].attachTask(this.tasks[task.code]);
        this.tasks[task.code].attachUser(this.users[user.code]);
    }

    /**
     * @param {User} user 
     * @param {Task} task 
     */
    detachUserTask(user, task){
        user.detachTask(task);
        task.detachUser(user);
        if (task.users.length === 0){
            this.removeTask(task);
        }
        if (user.tasks.length === 0){
            this.removeUser(user);
        }
    }

    /**
     * @param {User} user 
     * @param {Task} task 
     */
    addSubTaskUser(user, task){
        if (!user) {return;}
        if (!this.users[user.code]) {
            this.users[user.code] = user.original();
            this.usersCodes.push(user.code);
        }
        for (let i = 0; i < task.subtasks.length;  i++){
            if (task.subtasks[i].users.indexOf(user.code) === -1){
                task.subtasks[i].attachUser(this.users[user.code]);
                this.users[user.code].attachTask(task.subtasks[i]);
            }
        }
    }

    addTaskWithoutUser(task) {
        if (this.taskTrash.indexOf(task.code) === -1){
            this.taskTrash.push(task.original());
        }
    }

    recycleTask(task) {
        const idx = this.taskTrash.findIndex(t => t.code === task.code);
        if (idx !== -1) {
            this.taskTrash.splice(idx, 1);
        }
    }

    removeUser(user) {
        const idx = this.usersCodes.indexOf(user.code);
        if (idx !== -1) {
            this.usersCodes.splice(idx, 1);
            this.users[user.code] = null;
        }
    }

    removeTask(task) {
        const idx = this.tasksCodes.indexOf(task.code);
        if (idx !== -1) {
            this.tasksCodes.splice(idx, 1);
            this.tasks[task.code] = null;
            this.addTaskWithoutUser(task);
        }
    }

    computeFitness() {
        const conflictsFactor = 0;
        const usersFactor = 3;
        const allocationFactor = 44;

        this.fitness = 0;
        let conflicts = 0;

        for (let i = 0; i < this.tasksCodes.length; i++) {
            const task = this.tasks[this.tasksCodes[i]];
            this.fitness += task.computeFitness();

            if (task.personsRequired <= 1 || task.users.length <= 1) continue;

            for (let j = 0; j < task.users.length; j++) {
                conflicts += this.checkConflicts(task.users[j], task);
            }
        }

        const alloc = this.getTotalAllocationInMinutes();
        const avail = this.getTotalAvaiabilityInMinutes();
        this.allocation = Math.round(alloc / avail * 100) / 100;

        this.fitness += ( ( conflicts * conflictsFactor) 
                        + ( Math.pow(this.usersCodes.length - 1, 2) * usersFactor)
                        + ( Math.abs(1 - this.allocation) * allocationFactor)
                        ) * Math.abs((1 * Math.ceil(1 - this.allocation)) - this.allocation);

        return this.fitness;
    }

    checkConflicts(userCode, task) {
        const user = this.users[userCode];
        let total = 0;

        for (let i = 0; i < user.tasks.length; i++){
            if (user.tasks[i] !== task.code && this.tasks[user.tasks[i]] && task.interval.inConflicInterval(this.tasks[user.tasks[i]].interval)) total++;
        }

        return total;
    }

    getTotalAllocationInMinutes() {
        let total = 0;
        for(let i = 0; i < this.usersCodes.length; i++){
            total += this.users[this.usersCodes[i]].totalWorkLoad;
        }
        return total;
    }

    getTotalAvaiabilityInMinutes() {
        let total = 0;
        for(let i = 0; i < this.usersCodes.length; i++){
            total += this.users[this.usersCodes[i]].totalCapacity;
        }
        return total;
    }
}
module.exports = Individual;