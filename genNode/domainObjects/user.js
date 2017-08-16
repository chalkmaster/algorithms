const skillKind = require('../domainObjects/skillKind');
const Task = require('./task');

module.exports = class User {
    /**
     * Construtor
     * @param {string} code código do usuário
     * @param {number} workCapacity capacidade de trabalho em horas
     * @param {string} location localização atendida
     * @param {skillKind[]} skills habilidades de manutenção
     * @param {Task[]} tasks taregas alocadas
     */
    constructor(code, workCapacity, location, skills = [], tasks = []) {
        this.code = code;
        this.workCapacity = workCapacity;
        this.location = location;
        this.skills = skills;
        this.tasks = tasks;
    }

    /**
     * Calcula a capacidade de trabalho restante a partir das tarefas já atribuidas ao usuário
     * @returns {Number}
     */
    getRemaningWorkCapacity(){
        let total = this.workCapacity;
        for(let task of this.tasks)
            total -= task.workload;
        return total;
    }


    /**
     * Atribui a tarefa ao usuário
     * @param {Task} task
     */
    attachTask(task) {
        if (!task) return;
        this.tasks.push(task);
    }

    /**
     * Retorna o total de trabalho alocado para o usuário
     */
    getTotalWorkload(){
        let total = 0;
        for(let task of this.tasks)
            total += task.workload;
        return total;
    }
};