const skillKind = require('../domainObjects/skillKind');
const task = require('./task');

module.exports = class User {
    /**
     * Construtor
     * @param {string} code código do usuário
     * @param {number} workCapacity capacidade de trabalho em horas
     * @param {string} location localização atendida
     * @param {skillKind} skills habilidades de manutenção
     * @param {task} tasks taregas alocadas
     */
    constructor(code, workCapacity, location, skills = [], tasks = []) {
        this.code = code;
        this.workCapacity = workCapacity;
        this.location = location;
        this.skills = skills;
        this.tasks = tasks;
    }

    getWorkload(){
        let total = this.workCapacity;
        for(let task of this.tasks)
            total -= task.workload;
        return total;
    }

    attachTask(task) {
        if (!task) return;

        this.tasks.push(task);

        return this;
    }

    detachTask(task) {
        if (!task) return;

        const taskIndex = this.tasks.findIndex(t => t.code === task.code);
        this.tasks.splice(taskIndex, 1);

        return this;
    }
    
};