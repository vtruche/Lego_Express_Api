const express = require('express');
const app = express();

function myErrorMiddleware(err, req, res, next){
    res.status(500).send({erreur: err.message});
}

app.get('/', (req, res, next) => {
  try {
    throw new Error('ceci est un bug');
  } catch(err) {
    next(err)
  }
})

app.use(myErrorMiddleware);



app.listen(3000);
