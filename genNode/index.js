const express = require('express');
const GenService = require('./services/genService');
const r = require('./services/resourceService');

const app = express();

app.use(express.static('public'));

app.get('/tasks', (req, resp) => {
    let service = new GenService();
    //let resources = new r();
    let result = service.run();
    resp.json(result);
    resp.end();
});

app.listen(8080, () => {
    console.log(`I'm alive!`);
});