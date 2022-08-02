//Apporter securite supplémentaire avec un plugin mongoose

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const app = express();
//récuperation des variables d'environnement
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

//Gere le probléme de l'image illisible avec Helmet
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.crossOriginResourcePolicy({ policy: 'same-site' }));
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
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

//Nettoye les données recues (enlevement de clée commencant par $)
//pour eviter l'injection
app.use(
  mongoSanitize({
    allowDots: true,
    replaceWith: '_',
  })
);

app.use(express.json());

//Gestionnaire de routage pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;
