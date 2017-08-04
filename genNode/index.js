const express = require('express');
const GenService = require('./services/genService');

const app = express();

app.use(express.static('public'));

app.get('/tasks', (req, resp) => {
    let service = new GenService();
    resp.json(service.generateInitialPopulation(10));
    resp.end();
})

app.listen(8080, () => {
    console.log(`I'm alive!`);
});