const express = require('express');
const app = express();

function modifyRequestObject(req, res, next) {
    req.nouveau = { nouveauTruc: "je nexistais pas avant"};
    next();
}

function modifyResponseObject(req, res, next) {
    res.locals.blabla = "je nexistais pas avant";
    next();
}

function blockDeleteRequest(req, res,next){;
    if (req.method === "DELETE") {
          throw new Error('NO DELETE PLEASE');
        }
    else next();
}

function blockPutRequest(req, res,next){
    if (req.method === "PUT") {
          res.status(400).send('NO DELETE PLEASE'); // va interrompre ma chaine de middleware.
        }
    else {next()}
}


app.use(blockDeleteRequest);
app.use(modifyRequestObject);
app.use(modifyResponseObject);
app.use(blockPutRequest);

app.get('/', (req, res) => {
    console.log(req.nouveau)
    console.log(res.locals)
    res.send('Hello World');
})

app.put('/', (req, res) => {
    console.log("I AM IN"); // je ne serai jamais exécuté.
    res.send('Hello');
})

app.listen(3000);
