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
    getTools() {
        return this.tools;
    }

    /**
     * retornas todas as tarefas que necessitam as habilidades do usuário e que ainda cabem na fila dele
     * @param {User} user 
     * @param {String[]} tasksToSkip Lista de códigos para ignorar
     */
    getTasksByUserSkills(user, tasksToSkip = []) {
        return this.getTasks().filter((t) => {
            return user.skills.indexOf(t.requiredSkill) != -1 && tasksToSkip.indexOf(t.code) == -1;
        });
    }

    /**
     * retorna tarefas que não requerem nenhuma habildiade especial
     * @param {number} maxWorkload tempo máximo previsto de uma tarefa
     * @param {String[]} tasksToSkip  Lista de códigos para ignorar
     */
    getTasksWithoutRequiredSkill(tasksToSkip = []) {
        return this.getTasks().filter((t) => {
            return (!t.requiredSkill || t.requiredSkill == '') && tasksToSkip.indexOf(t.code) == -1;
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
        this.initializeTasksStatic();
    }

    initializeTools() {
        this.tools.push(new Tool('CF1', toolsKind.SCREWDRIVER));
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

    initializeTasksStatic() {
        let list = [
            { "code": "tsk-15", "createdAt": "2017-07-28T03:00:00.000Z", "criticality": "0-HIGH", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-29", "createdAt": "2017-07-10T03:00:00.000Z", "criticality": "0-HIGH", "workload": 6, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-46", "createdAt": "2017-07-03T03:00:00.000Z", "criticality": "0-HIGH", "workload": 1, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-5", "createdAt": "2017-07-17T03:00:00.000Z", "criticality": "0-HIGH", "workload": 2, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-9", "createdAt": "2017-07-11T03:00:00.000Z", "criticality": "0-HIGH", "workload": 1, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-41", "createdAt": "2017-07-18T03:00:00.000Z", "criticality": "0-HIGH", "workload": 6, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-11", "createdAt": "2017-07-26T03:00:00.000Z", "criticality": "0-HIGH", "workload": 8, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-12", "createdAt": "2017-07-13T03:00:00.000Z", "criticality": "0-HIGH", "workload": 1, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-2", "createdAt": "2017-07-22T03:00:00.000Z", "criticality": "0-HIGH", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-37", "createdAt": "2017-07-16T03:00:00.000Z", "criticality": "0-HIGH", "workload": 4, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-18", "createdAt": "2017-07-10T03:00:00.000Z", "criticality": "0-HIGH", "workload": 1, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-21", "createdAt": "2017-07-12T03:00:00.000Z", "criticality": "0-HIGH", "workload": 10, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-35", "createdAt": "2017-07-26T03:00:00.000Z", "criticality": "0-HIGH", "workload": 2, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-1", "createdAt": "2017-07-03T03:00:00.000Z", "criticality": "0-HIGH", "workload": 2, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-26", "createdAt": "2017-07-02T03:00:00.000Z", "criticality": "0-HIGH", "workload": 8, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-27", "createdAt": "2017-07-24T03:00:00.000Z", "criticality": "0-HIGH", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-25", "createdAt": "2017-07-24T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-17", "createdAt": "2017-07-05T03:00:00.000Z", "criticality": "1-MEDium", "workload": 8, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-47", "createdAt": "2017-07-12T03:00:00.000Z", "criticality": "1-MEDium", "workload": 2, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-19", "createdAt": "2017-07-30T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-36", "createdAt": "2017-07-29T03:00:00.000Z", "criticality": "1-MEDium", "workload": 2, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-6", "createdAt": "2017-07-30T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-22", "createdAt": "2017-07-10T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-23", "createdAt": "2017-07-07T03:00:00.000Z", "criticality": "1-MEDium", "workload": 6, "requiredTool": "Hammer", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-45", "createdAt": "2017-07-07T03:00:00.000Z", "criticality": "1-MEDium", "workload": 1, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-38", "createdAt": "2017-07-29T03:00:00.000Z", "criticality": "1-MEDium", "workload": 2, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-14", "createdAt": "2017-07-05T03:00:00.000Z", "criticality": "1-MEDium", "workload": 4, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-43", "createdAt": "2017-07-28T03:00:00.000Z", "criticality": "1-MEDium", "workload": 8, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-28", "createdAt": "2017-07-02T03:00:00.000Z", "criticality": "1-MEDium", "workload": 6, "requiredTool": "Hammer", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-0", "createdAt": "2017-07-02T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-30", "createdAt": "2017-07-08T03:00:00.000Z", "criticality": "1-MEDium", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-34", "createdAt": "2017-07-17T03:00:00.000Z", "criticality": "1-MEDium", "workload": 7, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-32", "createdAt": "2017-07-10T03:00:00.000Z", "criticality": "1-MEDium", "workload": 1, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-33", "createdAt": "2017-07-21T03:00:00.000Z", "criticality": "1-MEDium", "workload": 1, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-42", "createdAt": "2017-07-20T03:00:00.000Z", "criticality": "2-low", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-31", "createdAt": "2017-07-25T03:00:00.000Z", "criticality": "2-low", "workload": 5, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-20", "createdAt": "2017-07-29T03:00:00.000Z", "criticality": "2-low", "workload": 1, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-16", "createdAt": "2017-07-25T03:00:00.000Z", "criticality": "2-low", "workload": 5, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-13", "createdAt": "2017-07-17T03:00:00.000Z", "criticality": "2-low", "workload": 4, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-39", "createdAt": "2017-07-13T03:00:00.000Z", "criticality": "2-low", "workload": 2, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-40", "createdAt": "2017-07-01T03:00:00.000Z", "criticality": "2-low", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-10", "createdAt": "2017-07-20T03:00:00.000Z", "criticality": "2-low", "workload": 1, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-24", "createdAt": "2017-07-26T03:00:00.000Z", "criticality": "2-low", "workload": 8, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-8", "createdAt": "2017-07-27T03:00:00.000Z", "criticality": "2-low", "workload": 1, "requiredTool": "Screw Driver", "requiredSkill": "Mechanic", "user": "" },
            { "code": "tsk-44", "createdAt": "2017-07-16T03:00:00.000Z", "criticality": "2-low", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-7", "createdAt": "2017-07-03T03:00:00.000Z", "criticality": "2-low", "workload": 3, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-4", "createdAt": "2017-07-15T03:00:00.000Z", "criticality": "2-low", "workload": 6, "requiredTool": "Hammer", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-3", "createdAt": "2017-07-03T03:00:00.000Z", "criticality": "2-low", "workload": 3, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" },
            { "code": "tsk-48", "createdAt": "2017-07-21T03:00:00.000Z", "criticality": "2-low", "workload": 4, "requiredTool": "Screw Driver", "requiredSkill": "Woodworker", "user": "" },
            { "code": "tsk-49", "createdAt": "2017-07-24T03:00:00.000Z", "criticality": "2-low", "workload": 8, "requiredTool": "Screw Driver", "requiredSkill": "Eletronics", "user": "" }];
        for (let t of list)
            this.tasks.push(new Task(t.code, new Date(t.createdAt), t.criticality, t.workload, t.requiredTool, t.requiredSkill));
    }
    initializeTasksRandom() {
        //cria 50 OS's aleatóreas na memória
        for (let i = 0; i < 50; i++) {
            const criticalityRamdom = mathHelper.getRandomInt(1, 3);
            const toolRamdom = mathHelper.getRandomInt(1, 10);
            const skillRamdom = mathHelper.getRandomInt(1, 3);

            const taskCode = 'tsk-' + i.toString();
            const taskDate = new Date(2017, 6, mathHelper.getRandomInt(1, 30));
            const taskCriticality = criticalityRamdom == 1 ? criticalityKind.HIGH : (criticalityRamdom == 2 ? criticalityKind.MEDIUM : criticalityKind.LOW);
            const taskTool = toolRamdom % 2 == 0 ? toolsKind.SCREWDRIVER : toolsKind.HAMMER;
            const taskSkill = skillRamdom == 1 ? skillKind.WOODWORKER : (skillRamdom == 2 ? skillKind.MECHANIC : skillKind.ELETRONICS);

            this.tasks.push(new Task(taskCode, taskDate, taskCriticality, mathHelper.getRandomInt(1, 3), taskTool, taskSkill));
        }

        this.tasks = this.getTasksSortedByCriticality();
    }

    getTasksSortedByCriticality() {
        return this.tasks.sort((a, b) => {
            return a.criticality > b.criticality ? 1 : a.criticality < b.criticality ? -1 : 0;
        });
    }
};