const multer = require('multer');
const fs = require('fs');
//test

//Dictionnaire MIMES pour avoir la bonne extension de fichier
const MIME_TYPES = {
  'images/jpg': 'jpg',
  'images/jpeg': 'jpg',
  'images/png': 'png',
};

const storage = multer.diskStorage({
  //Indique que les images doivent s'enregistrer dans le dossier IMAGES
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  //Nommage du fichier
  filename: (req, file, callback) => {
    const sauceObject = JSON.parse(req.body.sauce);
    let regex = new RegExp(/[a-zA-Z]+$/);

    if (
      regex.test(...sauceObject.name) &&
      regex.test(...sauceObject.manufacturer) &&
      regex.test(...sauceObject.description) &&
      regex.test(...sauceObject.mainPepper)
    ) {
      const name = file.originalname.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    } else {
      console.log('la condition ne marche pas donc on tombe ici dans le ELSE');
      callback(null, 'erreur');
      fs.unlink('images/erreur', () => {});
      //supprimer le fichier erreur
    }
  },
});

module.exports = multer({ storage }).single('image');
