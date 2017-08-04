const toolsKind = require('../domainObjects/toolsKind');
const skillKind = require('../domainObjects/skillKind');
const criticalityKind = require('../domainObjects/criticalityKind');

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
        this.users.push({
            code: 'U1',
            workload: 8,
            location: 'BH',
            skills: [skillKind.ELETRONICS],
            tasks: [],
        });
        this.users.push({
            code: 'U2',
            workload: 8,
            location: 'BH',
            skills: [skillKind.MECHANIC],
            tasks: [],
        });
        this.users.push({
            code: 'U3',
            workload: 8,
            location: 'BH',
            skills: [skillKind.WOODWORKER],
            tasks: [],
        });
        this.users.push({
            code: 'U4',
            workload: 8,
            location: 'BH',
            skills: [skillKind.ELETRONICS, skillKind.MECHANIC],
            tasks: [],
        });
        this.users.push({
            code: 'U5',
            workload: 8,
            location: 'SP',
            skills: [skillKind.ELETRONICS, skillKind.WOODWORKER],
            tasks: [],
        });
    }

    initializeTasks() {
        let date = new Date(2017, 7, 1);
        this.tasks.push({
            code: 'tsk-1',
            createdAt: date,
            criticality: criticalityKind.HIGH,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 2,
        });
        date = new Date(2017, 7, 15);
        this.tasks.push({
            code: 'tsk-2',
            createdAt: date,
            criticality: criticalityKind.HIGH,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 4,
        });
        date = new Date(2017, 7, 31);
        this.tasks.push({
            code: 'tsk-3',
            createdAt: date,
            criticality: criticalityKind.HIGH,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 6,
        });
        date = new Date(2017, 7, 1);
        this.tasks.push({
            code: 'tsk-4',
            createdAt: date,
            criticality: criticalityKind.MEDIUM,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 3,
        });
        date = new Date(2017, 7, 12)
        this.tasks.push({
            code: 'tsk-5',
            createdAt: date,
            criticality: criticalityKind.MEDIUM,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.MECHANIC,
            workload: 1,
        });
        date = new Date(2017, 7, 17)
        this.tasks.push({
            code: 'tsk-6',
            createdAt: date,
            criticality: criticalityKind.MEDIUM,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 2,
        });
        date = new Date(2017, 7, 29);
        this.tasks.push({
            code: 'tsk-7',
            createdAt: date,
            criticality: criticalityKind.LOW,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.MECHANIC,
            workload: 4,
        });
        date = new Date(2017, 7, 30)
        this.tasks.push({
            code: 'tsk-8',
            createdAt: date,
            criticality: criticalityKind.LOW,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 6,
        });
        date = new Date(2017, 7, 1);
        this.tasks.push({
            code: 'tsk-9',
            createdAt: date,
            criticality: criticalityKind.LOW,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.WOODWORKER,
            workload: 1,
        });
        date = new Date(2017, 7, 30);
        this.tasks.push({
            code: 'tsk-10',
            createdAt: date,
            criticality: criticalityKind.MEDIUM,
            requiredTool: toolsKind.SCREWDRIVER,
            requiredSkill: skillKind.MECHANIC,
            workload: 1,
        });
        this.tasks = this.getTasksSortedByCriticality();
    }

    getTasksSortedByCriticality() {
        return this.tasks.sort((a, b) => {
            return a.criticality > b.criticality ? 1 : a.criticality < b.criticality ? -1 : 0;
        });
    }
}