//Verification d'un mots de passe assez securisé de la part de l'utilisateur

const passwordValidator = require('password-validator');
const { schema } = require('../models/User');

//création du schema
const passwordSchema = new passwordValidator();

//schema que doit respecter le MDP

passwordSchema
  .is()
  .min(6) //Minimum de 6 caractère
  .is()
  .max(100) //Maximum de 100 caractère
  .has()
  .uppercase() //Doit avoir des majuscule
  .has()
  .lowercase() //Doit avoir des miniscule
  .has()
  .digits(2) //Minimum de 2 chiffres
  .has()
  .not()
  .spaces() //Aucune espace
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123']); // Valeur Blacklister

//Vérification de qualité du MDP par rapport au schema

module.exports = (req, res, next) => {
  if (passwordSchema.validate(req.body.password)) {
    next();
  } else {
    return res
      .status(400)
      .json({
        error: `Le mot de passe n'est pas assez fort ${passwordSchema.validate(
          'req.body.password',
          { list: true }
        )} `,
      });
  }
};
