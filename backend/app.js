//Apporter securite supplémentaire avec un plugin mongoose

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const app = express();

require('dotenv').config();

const path = require('path');

//Connection a la base de donnée
mongoose
  .connect(process.env.DATA_BASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connexion à Mongodb réussie ! '))
  .catch(() => console.log('Connexion à MongoDB échouée ! '));
//Option pour avoir plus d'info sur le debug
// mongoose.set('debug', true);

// app.use(helmet());
//Erreur CORS

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
app.use(express.json());

//Gestionnaire de routage pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
