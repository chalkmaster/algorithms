const express = require('express');
const GenService = require('./services/genService');

const app = express();

app.use(express.static('public'));

app.get('/tasks', (req, resp) => {
    let service = new GenService();
    let result = service.run();
    resp.json(result);
    resp.end();
});

app.listen(8080, () => {
    console.log(`I'm alive!`);
});