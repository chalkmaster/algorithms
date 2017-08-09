const toolsKind = require('../domainObjects/toolsKind');
const skillKind = require('../domainObjects/skillKind');
const criticalityKind = require('../domainObjects/criticalityKind');

module.exports = class Task {
    /**
     * 
     * @param {String} code código da tarefa
     * @param {Date} createdAt data de criação da tarefa
     * @param {criticalityKind} criticality criticidade da tarefa
     * @param {Number} workload tempo previsto para execução
     * @param {toolsKind} requiredTool ferramentas necessárias
     * @param {skillKind} requiredSkill habilidades específicas necessárias
     */
    constructor(code, createdAt, criticality, workload, requiredTool = null, requiredSkill = null) {
        this.code = code;
        this.createdAt = createdAt;
        this.criticality = criticality;
        this.workload = workload;
        this.requiredTool = requiredTool;
        this.requiredSkill = requiredSkill;
        this.user = {};
    }

    attachUser(taskUser){
        this.user = taskUser;
    }
};