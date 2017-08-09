const express = require('express');
const GenService = require('./services/genService');

const app = express();

app.use(express.static('public'));

app.get('/tasks', (req, resp) => {
    let service = new GenService();
    let initialPopulation = service.getInitialPopulation();
    resp.json(initialPopulation);
    resp.end();
});

app.listen(8080, () => {
    console.log(`I'm alive!`);
});