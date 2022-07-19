const Sauce = require('../models/Sauce');
const fs = require('fs');
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params._id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
  //Parse l'objet envoyer et suppression des ID
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  //   delete sauceObject.userId;

  const sauce = new Sauce({
    ...sauceObject,
    // userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,

    likes: 0,
    disLike: 0,
    usersLiked: [''],
    usersDisliked: [''],
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Objet crée et enregistrée' }))
    .catch((error) => res.status(400).json({ error }));
};
