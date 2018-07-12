const Processor = require('./autoScheduling/genProcessor');
const SchedulingAdapter = require('./infrastructure/external/vesttro.scheduling.modelAdapter');
const PlantAdapter = require('./infrastructure/external/vesttro.plant.modelAdapter');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const CACHE_DATA_PATH = './cache/.gendata';
const CACHE_LOG_PATH = './cache/.genlog';

const app = express();

require('dotenv').config();

Date.prototype.toUTC = function () {
    return new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCMinutes(), this.getUTCSeconds(), this.getUTCMilliseconds());
};

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    next();
});



var progress = {};
var statusInfo = null;
var modelAdapter = null;
var processor = null;

function incr(data){
    if (!fs.existsSync(CACHE_LOG_PATH)){
        fs.writeFileSync(CACHE_LOG_PATH, JSON.stringify(data) + '\n', 'UTF8');
    } else {
        fs.appendFileSync(CACHE_LOG_PATH, JSON.stringify(data) + '\n', 'UTF8');
    }
    progress = data;
}

function log({statusCode, statusText}){
    if (!statusInfo) statusInfo = { startedAt: new Date() };
    statusInfo.statusCode = statusCode;
    statusInfo.statusText = statusText;
    statusInfo.statusUpdatedAt = new Date();
    if (!fs.existsSync(CACHE_LOG_PATH)){
        fs.writeFileSync(CACHE_LOG_PATH, JSON.stringify(statusInfo) + '\n', 'UTF8');
    } else {
        fs.appendFileSync(CACHE_LOG_PATH, JSON.stringify(statusInfo) + '\n', 'UTF8');
    }
}

app.get('/progress', (req, res) => {
    var data = {...progress};
    data.status = statusInfo;
    res.json(data).end();
});

app.get('/status', (req, res) => {
    res.json(statusInfo).end();
});

app.get('/abort', (req, res) => {
    if (processor){
        processor.abort();
        modelAdapter = null;
        processor = null;
    }
    res.sendStatus(200).end();
});

app.get('/logs', (req, res) => {    
    let cacheLog = '';
    if (fs.existsSync(CACHE_LOG_PATH)){
        cacheLog = fs.readFileSync(CACHE_LOG_PATH, 'UTF8');
    }
    if (!CACHE_LOG_PATH){
        res.json('no data').end();
        return;
    }
    res.json(cacheLog).end();
});

app.get('/results', (req, res) => {    
    let cacheData = '';
    if (fs.existsSync(CACHE_DATA_PATH)){
        cacheData = fs.readFileSync(CACHE_DATA_PATH, 'UTF8');
    }
    if (!cacheData){
        res.json('no data').end();
        return;
    }
    res.json(cacheData).end();
});

app.post('/run/:schedulingId', (req, res) => {
    const schedulingId = req.params.schedulingId
    if (fs.existsSync(CACHE_DATA_PATH)){
        fs.unlinkSync(CACHE_DATA_PATH);
    }

    progress = {};
    log({ statusCode: 102, statusText: `Scheduling Request Received, scheduling id = ${schedulingId}` });

    try{
        modelAdapter = new SchedulingAdapter(schedulingId);
        processor = new Processor(modelAdapter);

        processor.attachOnProgress(incr.bind(this));
        processor.attachLogger(log.bind(this));
        log({ statusCode: 102, statusText: `Ready to run` });
        processor.run().then(result => {
            fs.writeFileSync(CACHE_DATA_PATH, JSON.stringify(result), 'UTF8');
            modelAdapter = null;
            processor = null;
        }).catch(err => {
            log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
            console.log(err);
            modelAdapter = null;
            processor = null;
        });                        
        res.sendStatus(200).end();
    } catch(err){
        log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
        console.log(err);
        modelAdapter = null;
        processor = null;
    }
});

app.post('/optimise/:schedulingId', (req, res) => {
    const schedulingId = req.params.schedulingId
    if (fs.existsSync(CACHE_DATA_PATH)){
        fs.unlinkSync(CACHE_DATA_PATH);
    }

    progress = {};
    log({ statusCode: 102, statusText: `Optimise Request Received, scheduling id = ${schedulingId}` });

    try{
        modelAdapter = new SchedulingAdapter(schedulingId);
        processor = new Processor(modelAdapter);

        processor.attachOnProgress(incr.bind(this));
        processor.attachLogger(log.bind(this));
        log({ statusCode: 102, statusText: `Ready to run` });
        processor.optimise().then(result => {
            fs.writeFileSync(CACHE_DATA_PATH, JSON.stringify(result), 'UTF8');
            modelAdapter = null;
            processor = null;
        }).catch(err => {
            log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
            console.log(err);
            modelAdapter = null;
            processor = null;
        });                        
        res.sendStatus(200).end();
    } catch(err){
        log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
        console.log(err);
        modelAdapter = null;
        processor = null;
    }
});

app.post('/optimise/plant/:plantId', (req, res) => {
    const plantId = req.params.plantId
    const workcenters = req.body;

    if (fs.existsSync(CACHE_DATA_PATH)){
        fs.unlinkSync(CACHE_DATA_PATH);
    }

    progress = {};
    log({ statusCode: 102, statusText: `Optimise Request Received, plant id = ${plantId}` });

    try{
        modelAdapter = new PlantAdapter(plantId, workcenters);
        processor = new Processor(modelAdapter);

        processor.attachOnProgress(incr.bind(this));
        processor.attachLogger(log.bind(this));
        log({ statusCode: 102, statusText: `Ready to run` });
        processor.optimise().then(result => {
            fs.writeFileSync(CACHE_DATA_PATH, JSON.stringify(result), 'UTF8');
            modelAdapter = null;
            processor = null;
        }).catch(err => {
            log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
            console.log(err);
            modelAdapter = null;
            processor = null;
        });                        
        res.sendStatus(200).end();
    } catch(err){
        log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
        console.log(err);
        modelAdapter = null;
        processor = null;
    }
});

app.post('/run/plant/:plantId', (req, res) => {
    const plantId = req.params.plantId
    const workcenters = req.body;

    if (fs.existsSync(CACHE_DATA_PATH)){
        fs.unlinkSync(CACHE_DATA_PATH);
    }

    progress = {};
    log({ statusCode: 102, statusText: `Scheduling Request Received, plant id = ${plantId}` });

    try{
        modelAdapter = new PlantAdapter(plantId, workcenters);
        processor = new Processor(modelAdapter);

        processor.attachOnProgress(incr.bind(this));
        processor.attachLogger(log.bind(this));

        log({ statusCode: 102, statusText: `Ready to run` });
        processor.run().then(result => {
            fs.writeFileSync(CACHE_DATA_PATH, JSON.stringify(result), 'UTF8');
            modelAdapter = null;
            processor = null;
        }).catch(err => {
            log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
            console.log(err);
            modelAdapter = null;
            processor = null;
        });
        res.sendStatus(200).end();
    } catch(err){
        log({ statusCode: 500, statusText: `Process Error: \n${JSON.stringify(err)}` });
        console.log(err);
        modelAdapter = null;
        processor = null;
    }
});

app.listen(process.env.PORT, ()=>{
    console.log(`[${(new Date()).toLocaleString()}] running at ${process.env.PORT}`);
});