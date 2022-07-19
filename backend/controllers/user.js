const User = require('../models/User');

//Require de sécurité
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cryptoJs = require('crypto-js');

require('dotenv').config();

//Enregistrement Utilisateur
exports.signup = (req, res, next) => {
  //Chiffrage de l'email
  const emailCryptoJs = cryptoJs
    .HmacSHA256(req.body.email, process.env.ACCES_CRYPTOJS_MAIL)
    .toString();

  //Chiffrage du MDP
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: emailCryptoJs,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur crée ! ' }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Connexion utilisateur
exports.login = (req, res, next) => {
  //chiffrer l'email de la requete
  const emailCryptoJs = cryptoJs
    .HmacSHA256(req.body.email, process.env.ACCES_CRYPTOJS_MAIL)
    .toString();
  //On verifie le mail de l'utilisateur avec ceux enregistrer dans la base de donnée
  User.findOne({ email: emailCryptoJs })
    .then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Paire login/password incorrect' });
      } else {
        //Si le controle du mail est OK on controle le Password avec Bcrypt
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: 'Paire login/password incorrect' });
            } else {
              res.status(201).json({
                userId: user._id,
                token: jwt.sign(
                  { userId: user.id },
                  process.env.ACCES_SECRET_TOKEN,
                  { expiresIn: '24h' }
                ),
              });
            }
          })
          .catch((error) => {
            res.status(500).json({ error });
          });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
