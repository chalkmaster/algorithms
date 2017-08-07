const toolsKind = require('../domainObjects/toolsKind');
const skillKind = require('../domainObjects/skillKind');
const criticalityKind = require('../domainObjects/criticalityKind');
const User = require('../domainObjects/user');
const Task = require('../domainObjects/task');

module.exports = class resourceService {
    constructor() {
        this.tools = [];
        this.users = [];
        this.tasks = [];

        this.initialize();
    }

    initialize() {
        this.initializeTools();
        this.initializeUsers();
        this.initializeTasks();
    }

    initializeTools() {
        this.tools.push({
            code: 'CF1',
            type: toolsKind.SCREWDRIVER,
        });
        this.tools.push({
            code: 'CF2',
            type: toolsKind.SCREWDRIVER,
        });
        this.tools.push({
            code: 'M1',
            type: toolsKind.HAMMER,
        });
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
        for (let i = 0; i < 50; i++) {
            const criticalityRamdom = getRandom(0, 3);
            const toolRamdom = getRandom(1, 10);
            const skillRamdom = getRandom(0, 3);

            const taskCode = 'tsk-' + i.toString();
            const taskDate = new Date(2017, 7, getRandom(1, 30));
            const taskCriticality = criticalityRamdom == 1 ? criticalityKind.HIGH : (criticalityRamdom == 2 ? criticalityKind.MEDIUM : criticalityKind.LOW);
            const taskTool = toolRamdom % 2 == 0 ? toolsKind.SCREWDRIVER : toolsKind.HAMMER;
            const taskSkill = skillKind === 1 ? skillKind.WOODWORKER : (skillKind === 2 ? skillKind.MECHANIC : skillKind.ELETRONICS);

            this.tasks.push(new Task(taskCode, taskDate, taskCriticality, getRandom(1, 6), taskTool, taskSkill));
        }

        this.tasks = this.getTasksSortedByCriticality();

        function getRandom(min, max) {
            return Math.floor(min + ((Math.random() * (Math.abs(min) + max)) + 1));
        }
    }

    getTasksSortedByCriticality() {
        return this.tasks.sort((a, b) => {
            return a.criticality > b.criticality ? 1 : a.criticality < b.criticality ? -1 : 0;
        });
    }
}