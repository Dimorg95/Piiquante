const Sauce = require('../models/Sauce');
const fs = require('fs');

//Demander toute les sauces
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
//Demander une sauce selon son ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};
//Création d'une sauce
exports.createSauce = (req, res, next) => {
  //Parse l'objet envoyer et suppression des ID
  const sauceObject = JSON.parse(req.body.sauce);
  //Ajout regex formulaire test

  let regex = new RegExp(/[a-zA-Z]+$/);

  if (
    regex.test(...sauceObject.name) &&
    regex.test(...sauceObject.manufacturer) &&
    regex.test(...sauceObject.description) &&
    regex.test(...sauceObject.mainPepper)
  ) {
    delete sauceObject._id;
    delete sauceObject.userId;

    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,

      usersLiked: [''],
      usersDisliked: [''],
    });
    sauce
      .save()
      .then(() =>
        res.status(201).json({ message: 'Objet crée et enregistrée' })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    //test

    res.status(401).json({ message: 'Verification non faite refait batard' });
  }
};
//Suppression de sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non Autorisé' });
      } else {
        //Suppression de l'images lié au post
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Objet supprimé' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
//Modification de sauce
exports.modifySauce = (req, res, next) => {
  //Si on a un changement d'image on supprime l'ancienne
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      })
      .catch((error) => res.status(400).json({ error }));
  }
  //On rajoute la nouvelle en cas de changement d'image
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObject._userId;
  let regex = new RegExp(/[a-zA-Z]+$/);
  if (
    regex.test(...sauceObject.name) &&
    regex.test(...sauceObject.manufacturer) &&
    regex.test(...sauceObject.description) &&
    regex.test(...sauceObject.mainPepper)
  ) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Non Autorisé' });
        } else {
          //test condition pour accepter le formulaire

          //Ont mets a jour la sauce avec les changements
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
            .catch((error) => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    res.status(401).json({ message: 'Verification non faite refait batard' });
  }
};

//Semble marcher a reverifier avec postman possible bug :/
exports.likesDislikesSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch (like) {
    //Le cas ou on ajoute un like ! ($push ajoute notre userId au tableau UsersDislikes)
    //$inc ajoute notre like

    case 1:
      //Si l'userId n' est  pas deja present dans usersliked alors on execute le code sinon erreur

      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (
            sauce.usersLiked.includes(userId) ||
            sauce.usersDisliked.includes(userId)
          ) {
            res.status(401).json({ message: 'Vous avez deja aimé ce poste' });
          } else {
            Sauce.updateOne(
              { _id: sauceId },
              { $push: { usersLiked: userId }, $inc: { likes: +1 } }
            )
              .then(() => res.status(200).json({ message: 'Like' }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case 0:
      //Le cas ou on enleve notre like/dislike ($pull enleve le userId du tableau correspondant)
      //$inc enleve notre like ou dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() => res.status(200).json({ message: 'None' }))
              .catch((error) => res.status(400).json({ error }));
          }

          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: 'None' }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));

      break;

    case -1:
      //Le cas ou on ajoute un dislike ($push va push notre userId dans le tableau usersDisliked)
      //$inc ajoute un dislike
      //Si l'userId n' est  pas deja present dans usersdisliked alors on execute le code sinon erreur
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (
            sauce.usersDisliked.includes(userId) ||
            sauce.usersLiked.includes(userId)
          ) {
            res
              .status(401)
              .json({ message: `Vous avez déja dislike ce poste ` });
          } else {
            Sauce.updateOne(
              { _id: sauceId },
              { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
            )
              .then(() => res.status(200).json({ message: 'Dislike' }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log('erreur');
  }
};

//like/dislike verif
