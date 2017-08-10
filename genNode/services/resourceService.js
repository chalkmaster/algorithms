const mathHelper = require('../helpers/mathHelper');

const criticalityKind = require('../domainObjects/criticalityKind');
const skillKind = require('../domainObjects/skillKind');
const toolsKind = require('../domainObjects/toolsKind');

const User = require('../domainObjects/user');
const Task = require('../domainObjects/task');
const Tool = require('../domainObjects/tool');

module.exports = class resourceService {
    constructor() {
        this.tools = [];
        this.users = [];
        this.tasks = [];

        this.initialize();
    }

    /**
     * @returns {User[]}
     */
    getUsers() {
        return this.users;
    }

    /**
     * @returns {Task[]}
     */
    getTasks() {
        return this.tasks;
    }

    /**
     * @returns {Tool[]}
     */
    getTools(){
        return this.tools;
    }

    /**
     * retornas todas as tarefas que necessitam as habilidades do usuário e que ainda cabem na fila dele
     * @param {User} user 
     * @param {String[]} tasksToSkip Lista de códigos para ignorar
     */
    getTasksByUserSkills(user, tasksToSkip = []) {
        return this.getTasks().filter((t) => {
            return user.skills.indexOf(t.requiredSkill) != -1 && user.getRemaningWorkCapacity() - t.workload > -2 && tasksToSkip.indexOf(t.code) == -1;
        });
    }

    /**
     * retorna tarefas que não requerem nenhuma habildiade especial
     * @param {number} maxWorkload tempo máximo previsto de uma tarefa
     * @param {String[]} tasksToSkip  Lista de códigos para ignorar
     */
    getTasksWithoutRequiredSkill(maxWorkload = 8, tasksToSkip = []) {
        return this.getTasks().filter((t) => {
            return (!t.requiredSkill || t.requiredSkill == '') && maxWorkload > t.workload && tasksToSkip.indexOf(t.code) == -1;
        });
    }

    /**
     * recupera a ferramenta necessário para uma task
     * @param {Task} task 
     */
    getToolsByType(kind) {
        return this.getTools().filter((t) => {
            return kind === t.type;
        });
    }

    initialize() {
        this.initializeTools();
        this.initializeUsers();
        this.initializeTasks();
    }

    initializeTools() {
        this.tools.push(new Tool('CF1',toolsKind.SCREWDRIVER));
        this.tools.push(new Tool('CF2', toolsKind.SCREWDRIVER));
        this.tools.push(new Tool('M1', toolsKind.HAMMER));
    }

    initializeUsers() {
        this.users.push(new User('U1', 8, 'BH', [skillKind.ELETRONICS]));
        this.users.push(new User('U2', 8, 'BH', [skillKind.MECHANIC]));
        this.users.push(new User('U3', 8, 'BH', [skillKind.WOODWORKER]));
        this.users.push(new User('U4', 8, 'BH', [skillKind.ELETRONICS, skillKind.MECHANIC]));
        this.users.push(new User('U5', 8, 'SP', [skillKind.ELETRONICS, skillKind.WOODWORKER]));
    }

    initializeTasks() {
        //cria 50 OS's aleatóreas na memória
        for (let i = 0; i < 10; i++) {
            const criticalityRamdom = mathHelper.getRandomInt(1, 3);
            const toolRamdom = mathHelper.getRandomInt(1, 10);
            const skillRamdom = mathHelper.getRandomInt(1, 3);

            const taskCode = 'tsk-' + i.toString();
            const taskDate = new Date(2017, 6, mathHelper.getRandomInt(1, 30));
            const taskCriticality = criticalityRamdom == 1 ? criticalityKind.HIGH : (criticalityRamdom == 2 ? criticalityKind.MEDIUM : criticalityKind.LOW);
            const taskTool = toolRamdom % 2 == 0 ? toolsKind.SCREWDRIVER : toolsKind.HAMMER;
            const taskSkill = skillRamdom == 1 ? skillKind.WOODWORKER : (skillRamdom == 2 ? skillKind.MECHANIC : skillKind.ELETRONICS);

            this.tasks.push(new Task(taskCode, taskDate, taskCriticality, mathHelper.getRandomInt(1, 6), taskTool, taskSkill));
        }

        this.tasks = this.getTasksSortedByCriticality();

    }

    getTasksSortedByCriticality() {
        return this.tasks.sort((a, b) => {
            return a.criticality > b.criticality ? 1 : a.criticality < b.criticality ? -1 : 0;
        });
    }
};