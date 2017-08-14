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
    reset(){
        this.resources = new resourceService();
    }

    /**
     * Cria uma planejamento válido para o período
     */
    buildPlanning() {
        this.reset();
        const resources = this.getResources();

        let planList = [];
        let planedTasks = [];        
        let totalHours = this.config.workingDays * this.config.workingHours;

        for (let hour = 0; hour < totalHours; hour++) {
            for (let user of resources.getUsers()) {                
                if (user.getTotalWorkload() > totalHours)
                    continue;                
                let userPlan = this.buildValidPlanForUser(user, planedTasks);
                userPlan.id = `U${user.code}${hour}`;
                userPlan.adjusteHourByPosition(hour);
                userPlan.computeFitness(this.config);
                planList.push(userPlan);
            }
        }
        const notPlanedTasks = resources.getTasks().filter((t) => { return !t.user; });

        for (let task of notPlanedTasks) {
            let notPlanedPlan = new Plan(task);
            notPlanedPlan.id = `T${task.code}`;
            notPlanedPlan.adjusteHourByPosition(totalHours);
            notPlanedPlan.computeFitness(this.config);
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
    buildValidPlanForUser(planUser, planedTasks) {
        if (!planUser)
            return;

        const resources = this.getResources();

        let planTool = null;
        let planTask = null;

        const tasksThatRequireUserSkills = resources.getTasksByUserSkills(planUser, planedTasks);

        if (tasksThatRequireUserSkills && tasksThatRequireUserSkills.length > 0) {
            const drawnNumber = mathHelper.getRandomInt(0, tasksThatRequireUserSkills.length - 1);
            planTask = tasksThatRequireUserSkills[drawnNumber];
        } else {

            const tasksWithoutRequiredSkill = resources.getTasksWithoutRequiredSkill(planedTasks);

            if (tasksWithoutRequiredSkill && tasksWithoutRequiredSkill.length > 0) {
                const drawnNumber = mathHelper.getRandomInt(0, tasksWithoutRequiredSkill.length - 1);
                planTask = tasksWithoutRequiredSkill[drawnNumber];
            }
        }

        if (planTask) {
            planedTasks.push(planTask.code);

            planUser.attachTask(planTask);
            planTask.attachUser(planUser);

            const possibleTools = resources.getToolsByType(planTask.requiredTool);

            if (possibleTools && possibleTools.length > 0) {
                const drawn = mathHelper.getRandomInt(0, possibleTools.length - 1);
                planTool = possibleTools[drawn];
            }

        }

        return new Plan(planTask, planUser, planTool);
    }
};