// Validation 
const Joi = require("joi");
const bcrypt = require("bcrypt");

// Express + async errors
const express = require("express");
require("express-async-errors"); // bcrypt est asynchrone
const app = express();

// JWT + dotenv + vérification de la présence d'une variable d'environnement
const jwt = require("jsonwebtoken");
require("dotenv").config();
if (!process.env.JWT_PRIVATE_KEY) {
  console.log(
    "Vous devez créer un fichier .env qui contient la variable JWT_PRIVATE_KEY"
  );
  process.exit(1);
}

// Bases de donneés.
const Collection = require("../Collection");
const Accounts = new Collection("Accounts");

// On va avoir besoin de parser le json entrant dans req.body
app.use(express.json());


// route de debug
app.get("/accounts", (req, res) => {
  res.json(Accounts.getAll());
});


// INSCRIPTION
app.post("/signup", async (req, res) => {
  const payload = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(3).max(50).required(),
  });

  const { value: account, error } = schema.validate(payload);
  if (error) return res.status(400).send({ erreur: error.details[0].message });
  // AVANT D'INSCRIRE ON VERIFIE QUE LE COMPTE EST UNIQUE.
  const { id, found } = Accounts.findByProperty("email", account.email);
  if (found) return res.status(400).send("Please signin instead of signup");
  // WE NEED TO HASH THE PASSWORDW
  const salt = await bcrypt.genSalt(10);
  const passwordHashed = await bcrypt.hash(account.password, salt);
  account.password = passwordHashed;

  Accounts.insertOne(account);
  res.status(201).json({
    name: account.name,
    email: account.email,
  });
});

// CONNEXION
app.post("/signin", async (req, res, next) => {
  const payload = req.body;
  const schema = Joi.object({
    email: Joi.string().max(255).required().email(),
    password: Joi.string().min(3).max(50).required(),
  });

  const { value: connexion, error } = schema.validate(payload);

  if (error) return res.status(400).send({ erreur: error.details[0].message });
  // ON CHERCHE LE COMPTE DANS LA DB
  const { id, found: account } = Accounts.findByProperty(
    "email",
    connexion.email
  );
  if (!account) return res.status(400).send({ erreur: "Email Invalide" });

  // ON DOIT COMPARER LES HASH
  const passwordIsValid = bcrypt.compare(req.body.password, account.password);
  if (!passwordIsValid)
    return res.status(400).send({ erreur: "Mot de Passe Invalide" });

  //ON RETOURNE UN JWT
  const token = jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
  res.header("x-auth-token", token).status(200).send({ name: account.name });
});



// fin du fichier
if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("listening...");
  });
}

module.exports = { app, Accounts };