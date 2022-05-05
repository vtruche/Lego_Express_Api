const express = require('express');
const app = express();

function logRequest1(req, res, next) {
    console.log("#1", req.method, req.url);
    next();
}
function logRequest2(req, res, next) {
    console.log("#2", req.method, req.url);
    next();
}

app.use(logRequest1);
app.use(logRequest2);

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.listen(3000);