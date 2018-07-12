var pInterval = null;
var log = [];

function run() {
    callRun();
    startProgressMonitor();
}

function callRun() {
    document.getElementById('btnLog').setAttribute('disabled', 'disabled');
    document.getElementById('info').innerHTML = 'Recuperando dados do SAP';
    log = [];
    const request = new XMLHttpRequest();
    request.open('Post', '/run/E87316E8844119F1BEE3000C292FA113');
    request.send();
}

function results() {
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            if (request.status === 200) {
                document.getElementById('pb').setAttribute('value', request.responseText);
                showResults(JSON.parse(JSON.parse(request.responseText)));
                document.getElementById('btnLog').removeAttribute('disabled');
            }
        };
    }
    request.open('Get', '/results');
    request.send();
}

function showLog() {
    const tbody = document.getElementById('tLog');
    document.getElementById('clog').setAttribute('style', 'display:unset');
    tbody.innerHTML = "";
    let i = 1;
    log.forEach(data => {
        tbody.innerHTML += `<tr><td>${i++}<td><td>${logToHTML(data)}</td></tr>`
    });
}

function hideLog() {
    document.getElementById('clog').setAttribute('style', 'display:none');
}

function showResults(data) {
    const infoText = document.getElementById('info');
    const resultsContainner = document.getElementById('results');

    resultsContainner.innerHTML = '';

    infoText.innerHTML = `Melhor aptidão: <em>${data.fitness}</em> - Melhor Alocação: <em>${data.allocation}</em>`;
    const tasks = data.tasksCodes.map(code => data.tasks[code]).sort((a, b) => a.interval.start > b.interval.start ? 1 : -1);
    const tasksByUser = tasks.reduce((arr, task) => {
        const found = arr.find(i => i.user === task.users[0]);
        if (found) {
            found.tasks.push(task)
        } else {
            arr.push({ user: task.users[0], tasks: [task] });
        }
        return arr;
    }, []);
    tasksByUser.forEach(i => {
        const column = getColumn(i);
        resultsContainner.innerHTML += column;
    });
}

function getColumn(i) {
    let col = `<div class="column has-text-centered">
        <table class="table">
            <thead>
                <tr>
                    <th colspan="2" style="position: -webkit-sticky; position: sticky; top: -1px;"><div class="notification is-primary">Usuário: ${i.user}</div></th>
                </tr>
            </thead>
        <tbody>`;

    const tasksPerDay = i.tasks.reduce((arr, task) => {
        const found = arr.find(i => i.day === new Date(task.interval.start).getDate() + '/' + (new Date(task.interval.start).getMonth() + 1));
        if (found) {
            found.tasks.push(task)
        } else {
            arr.push({ day: new Date(task.interval.start).getDate() + '/' + (new Date(task.interval.start).getMonth() + 1), tasks: [task] });
        }
        return arr;
    }, []);

    tasksPerDay.forEach(i => {
        col += `<tr>
            <td>
                ${i.day}
            </td>
            <td>`
        i.tasks.forEach(task => {
            col += `<div class="box"><b>${task.orderId}</b> - <b style="color:red">FIT:${task.fitness}</b>                
                <br /><b>1º operação: </b>${task.activity}
                <br /><b>#</b>${task.personsRequired} -> ${task.users.join(', ')}
                <br /><b>Duração Total: </b>${task.totalDuration / 60}h
                <br /><b>De : </b><span class="is-danger">${new Date(task.interval.start).toLocaleDateString()} ${new Date(task.interval.start).toLocaleTimeString()}</span>
                <br /><b>Até: </b><span class="is-danger">${new Date(task.interval.end).toLocaleDateString()} ${new Date(task.interval.end).toLocaleTimeString()}</span>
                <br /><b>Máquina Parada: </b>${task.requiredStoppedCondition}
                <br /><b>OT: </b>${task.technicalObjectKey}
                <br /><b>wc: </b>${task.workcenter}
                <br /><b>Prioridade Ajustada: </b> ${task.priority}
                <br /><b>Ranking por usuário: </b> <ul>${JSON.stringify(task.usersRank).replace('{', '• ').replace(/,/g, '<br />• ').replace('}','').replace(/"/g,'').replace(/:/g,'->')}</ul>
                </div>`
        })
        col += `</td>
            </tr>`
    });
    col += `</tbody>
        </table>
    </div>`;
    return col;
}

function startProgressMonitor() {
    pInterval = setInterval(() => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    const data = JSON.parse(request.responseText);
                    if (data && data.percent) {
                        document.getElementById('pb').setAttribute('value', data.percent * 100);
                        document.getElementById('info').innerHTML = logToHTML(data);
                        if (data.step === 'Progress' && data.percent === 1) {
                            results();
                            clearInterval(pInterval);
                        }
                        log.push(data);
                    }
                } else {
                    document.getElementById('info').innerHTML = 'An error occurred during your request: ' + request.status + ' ' + request.statusText;
                }
            }
        };
        request.open('Get', '/progress');
        request.send();
    }, 1000);
}

function logToHTML(log) {
    return `<b>${log.message}</b><br /><b>Current Step</b>: ${log.step} - <b>Current Fitness:</b> ${log.currentFitness} - <b>Snapshot Allocation:</b> ${log.allocation}`;
}