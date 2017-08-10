const resourceService = require('./services/resourceService');

const dateHelper = require('./helpers/dateHelper');
const mathHelper = require('./helpers/mathHelper');

const User = require('./domainObjects/user');
const Plan = require('./domainObjects/plan');
const Planning = require('./domainObjects/planning');

module.exports = class GeneticFactory {
    constructor(config) {
        this.resources = new resourceService();
        this.config = config;
    }

    /**
     * @returns {resourceService}
     */
    getResources() {
        return this.resources;
    }

    /**
     * Cria uma planejamento válido para o período
     */
    buildPlanning() {
        const resources = this.getResources();

        let planList = [];
        let totalHours = this.config.workingDays * this.config.workingHours;

        for (let hour = 0; hour < totalHours; hour++) {
            for (let user of resources.users) {
                const userPlan = this.buildValidPlanForUser(user);
                if (!userPlan)
                    break;

                userPlan.adjusteHourByPosition(hour);
                userPlan.computeFitness();
                planList.push(userPlan);
            }
        }
        const notPlanedTasks = resources.getTasks().filter((t) => { return !t.user; });

        for (let task of notPlanedTasks){
            let notPlanedPlan = new Plan(task);
            notPlanedPlan.adjusteHourByPosition(totalHours);
            notPlanedPlan.computeFitness();
            planList.push(notPlanedPlan);
        }

        let planning = new Planning(planList);
        planning.computeFitness();
        return planning;
    }

    /**
     * Inicializa um plano válido para o usuário
     * @param {User} planUser
     */
    buildValidPlanForUser(planUser) {
        if (!planUser)
            return;

        const resources = this.getResources();

        let planedTasks = [];
        let planTool = null;
        let planTask = null;

        const tasksThatRequireUserSkills = resources.getTasksByUserSkills(planUser, planedTasks);

        if (tasksThatRequireUserSkills && tasksThatRequireUserSkills.length > 0) {
            const drawnNumber = mathHelper.getRandomInt(0, tasksThatRequireUserSkills.length - 1);
            planTask = tasksThatRequireUserSkills[drawnNumber];
        } else {

            const tasksWithoutRequiredSkill = resources.getTasksWithoutRequiredSkill(planUser.getRemaningWorkCapacity() + 2, planedTasks);

            if (tasksWithoutRequiredSkill && tasksWithoutRequiredSkill.length > 0) {
                const drawnNumber = mathHelper.getRandomInt(0, tasksWithoutRequiredSkill.length - 1);
                planTask = tasksWithoutRequiredSkill[drawnNumber];
            }
        }

        if (planTask) {
            planUser.attachTask(planTask);
            planTask.attachUser(planUser);

            const possibleTools = resources.getToolsByType(planTask.requiredTool);

            if (possibleTools && possibleTools.length > 0) {
                const drawn = mathHelper.getRandomInt(0, possibleTools.length - 1);
                planTool = possibleTools;
            }

            planedTasks.push(planTask.code);
        }

        return new Plan(planTask, planUser, planTool);
    }
};