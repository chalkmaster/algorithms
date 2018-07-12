const Task = require('./genObjects/task');
const User = require("./genObjects/user");
const Individual = require("./genObjects/individual");
const Interval = require("./genObjects/interval");
const Disponibility = require("./genObjects/disponibility");
const TechnicalObjects = require("./genObjects/technicalObject");
const MathHelper = require('../helpers/MathHelper');
const DateHelper = require('../helpers/DateHelper');

class modelLoader{
    constructor(modelAdapter){
        this._adapter = modelAdapter;
    }

    getModel(){
        return new Promise((resolve, reject) => {
            this._adapter.retrieveSapData().then(sapData => {
                const {users, usersCodes} = this.buildUsers(sapData);
                const technicalObjects = this.buildTechnicalObjects(sapData.calendar);
                const {tasks, tasksCodes} = this.buildTasks(sapData.operations, technicalObjects);
                this.fillWorkCenterData(sapData.workcenterCapacity, sapData.dataInicial, users, usersCodes);

                resolve({
                    start: sapData.dataInicial,
                    end: sapData.dataFinal,
                    users: users,
                    usersCodes: usersCodes,
                    tasks: tasks,
                    tasksCodes: tasksCodes,                    
                    technicalObjects: technicalObjects
                });
            });
        });
    }

     /**
     * carrega todas as pessoas que serão consideradas para a distribuição
     */
    buildUsers(sapData){
        const personCapacity = sapData.personCapacity;
        const assetPersonAbility = sapData.assetPersonAbility;
        const qualification = sapData.qualification;
        
        const users = {};
        const usersCodes = [];
        personCapacity.forEach(personData => {
            if (!users[personData.PersonNumber]){
                const user = new User();               
                user.loadFromSapModel(personData);
                user.addCapacity(personData);
                qualification.filter(qualification => qualification.Pernr === user.code).forEach(qualification => user.addQualification(qualification)); 
                assetPersonAbility.filter(speciality => speciality.Pernr === user.code).forEach(speciality => user.addSpeciality(speciality));
                users[user.code] = user;
                usersCodes.push(user.code);
            } else {
                users[personData.PersonNumber].addCapacity(personData);
            }
        });
        return {users : users, usersCodes : usersCodes};
    }

    /**
     * Carrega o calendário de máquinas paradas para os objetos técnicos usados para a programação
     * @param {{StartDate,StartTime,FinishDate,FinishTime,FuncLoc,Equnr,Plant,WorkCenter}[]} calendar 
     */
    buildTechnicalObjects(calendar){
        const technicalObjects = [];
        calendar.forEach(calendar => {
            const techObject = new TechnicalObjects();
            techObject.loadFromSapModel(calendar);
            technicalObjects.push(techObject);
        });
        return technicalObjects;
    }

    /**
     * Carrega as operações para que seja realizada a programação
     * @param {{Orderid, Activity, SubActivity, Priority, FlagParada, Plant, WorkCntr, DurationMinute, NumberOfCapac, ConstTypeStart, EarlSchStartD, EarlSchStartT, EarlSchFinisD, EarlSchFinisT, Equipment, Funcloc, DinamicPriority}[]} operation 
     * @param {TechnicalObjects[]} technicalObjects 
     */
    buildTasks(operation, technicalObjects) {   
        const tasks = {};
        const tasksCodes = [];
        const mappedOperations = [];
        let maxPriority = 0;
        //Garante o sequenciamento das operações pelo código para que seja possível realizar a lógica de agrupamento das atividades
        const orderedOperations = operation.sort((a, b) => {
            maxPriority = Math.max((a.DinamicPriority || parseInt(a.Priority) || 0), (b.DinamicPriority || parseInt(b.Priority) || 0), maxPriority);
            return (a.Orderid + a.Activity) > (b.Orderid + b.Activity) ? 1 : -1;
        });
        orderedOperations.forEach(operation => {
            operation.DinamicPriority = operation.DinamicPriority || operation.Priority || maxPriority;
            operation.maxPriority = maxPriority;

            const task = new Task();
            task.attachOperation(operation);
            if (task.duration && !task.hasDateRestriction && !operation.SubActivity) {
            // if (task.duration && !task.hasDateRestriction && !operation.SubActivity) {
                //Apenas uma tarefa é criada pra cada ordem, condensando os dados necessários de todas, desta forma os operações são aninhadas
                //como subtasks, pois toda a movimentação deve ser feita em grupos inteiros e nunca individualmente
                const mappedTask = mappedOperations.find(t => t.Orderid === operation.Orderid);
                if (mappedTask) {
                    if (tasks[mappedTask.code].totalDuration > 3000) {
                        tasks[mappedTask.code].totalDuration = 60;
                    }
                    tasks[mappedTask.code].requiredStoppedCondition = tasks[mappedTask.code].requiredStoppedCondition || task.requiredStoppedCondition;
                    tasks[mappedTask.code].technicalObject = tasks[mappedTask.code].technicalObject || task.technicalObject;
                    tasks[mappedTask.code].hasDateRestriction = tasks[mappedTask.code].hasDateRestriction || task.hasDateRestriction;
                    tasks[mappedTask.code].totalDuration += task.duration;
                    tasks[mappedTask.code].subtasks.push(task);
                } else {
                    tasks[task.code] = task;
                    tasksCodes.push(task.code);
                    mappedOperations.push({ Orderid: operation.Orderid, code: task.code });
                    const techObj = technicalObjects.find(to => to.key === task.technicalObjectKey);
                    if (techObj) {
                        task.attachTechnicalObject(techObj);
                    }
                }
            }
        });
        return {tasks : tasks, tasksCodes : tasksCodes};
    }

    /**
     * Cria usuários virtuais para um centro de trabalho para completar a quantidade de pessoas indicadas no centro de trabalho
     * caso a quantidade de usuários reais não seja suficiente para atender a demanda de alocação das operações
     * @param {{Plant, WorkCenter, NoOfIndCap, OperatingTime, Capacity, PersonList}[]} workcenterCapacity 
     * @param {Date} dataInicial 
     * @param {User[]} users 
     */
    fillWorkCenterData(workcenterCapacity, dataInicial, users, usersCodes){
        const workcenters = {};

        workcenterCapacity.forEach(wc => {
            if (wc.PersonList) {
                wc.PersonList = JSON.parse(wc.PersonList).Result.PERSONLIST.map(p => p.PERSON); //
                if (!workcenters[wc.WorkCenter]){
                    workcenters[wc.WorkCenter] = {
                        sapModel: wc,
                        qtd: 0
                    };
                }
                wc.PersonList.forEach(userCode => {
                    if (users[userCode]){
                        users[userCode].addWorkcenter(wc.WorkCenter);
                        workcenters[wc.WorkCenter].qtd++;
                    }
                });
            }

            let qtd = workcenters[wc.WorkCenter] ? workcenters[wc.WorkCenter].qtd : 0;
            while (wc.NoOfIndCap > qtd){
                const user = new User();
                const personData = {
                    PersonNumber: `${wc.WorkCenter}-virtual-${qtd}`,
                    PersonName: `${wc.WorkCenter}-virtual-${qtd}`,
                    Plant: wc.Plant,
                    Capacity: wc.Capacity * 60,
                    CapacityDate: `\/Date(${dataInicial.getTime()})\/`,
                    StartTime: 'PT09H00M00S'
                };

                user.loadFromSapModel(personData);
                //FIX: è muito lento criar todos os dias
                // for(let i = 0; i < wc.Capacity / wc.OperatingTime; i++) {
                    user.addCapacity(personData)
                //     const nextDay = new Date(dataInicial);
                //     nextDay.setDate(nextDay.getDate() + 1);
                //     personData.CapacityDate = `\/Date(${nextDay.getTime()})\/`;
                // }
                user.addWorkcenter(wc.WorkCenter)
                users[user.code] = user;
                usersCodes.push(user.code);
                qtd++;
            }
        });
        return;
    }
}

module.exports = modelLoader;