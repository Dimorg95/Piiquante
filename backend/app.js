const express = require('express');
const mongoose = require('mongoose');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const DATA_BASE_URL = process.env.DATA_BASE_URL;

//Connection a la base de donnée
mongoose
  .connect(DATA_BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à Mongodb réussie ! '))
  .catch(() => console.log('Connexion à MongoDB échouée ! '));

app.use(express.json);
module.exports = app;
