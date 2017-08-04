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
        this.tasks.push(new Task('tsk-1', new Date(2017, 7, 1), criticalityKind.HIGH, 2, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-2', new Date(2017, 7, 15), criticalityKind.HIGH, 4, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-3', new Date(2017, 7, 31), criticalityKind.HIGH, 6, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-4', new Date(2017, 7, 1), criticalityKind.MEDIUM, 3, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-5', new Date(2017, 7, 12), criticalityKind.MEDIUM, 1, toolsKind.SCREWDRIVER, skillKind.MECHANIC));
        this.tasks.push(new Task('tsk-6', new Date(2017, 7, 17), criticalityKind.MEDIUM, 2, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-7', new Date(2017, 7, 29), criticalityKind.LOW, 4, toolsKind.SCREWDRIVER, skillKind.MECHANIC));
        this.tasks.push(new Task('tsk-8', new Date(2017, 7, 30), criticalityKind.LOW, 6, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-9', new Date(2017, 7, 1), criticalityKind.LOW, 1, toolsKind.SCREWDRIVER, skillKind.WOODWORKER));
        this.tasks.push(new Task('tsk-10', new Date(2017, 7, 30), criticalityKind.MEDIUM, 1, toolsKind.SCREWDRIVER, skillKind.MECHANIC));
        this.tasks = this.getTasksSortedByCriticality();
    }

    getTasksSortedByCriticality() {
        return this.tasks.sort((a, b) => {
            return a.criticality > b.criticality ? 1 : a.criticality < b.criticality ? -1 : 0;
        });
    }
}