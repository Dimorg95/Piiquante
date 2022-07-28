// module.exports = (req, res, next) => {
//   if (JSON.parse(req.body.sauce !== undefined)) {
//     const sauce = JSON.parse(req.body.sauce);
//     let { name, manufacturer, description, mainPepper } = sauce;
//     let tabToTrim = [];
//     //On "trim", c'est a dire qu'on enleve les espace que l'utilisateur a rentré
//     //dans les champ du formulaire

//     function toTrim(...string) {
//       tabToTrim = string.map((element) => element.trim());
//     }
//     toTrim(name, manufacturer, description, mainPepper);

//     //Verification du nombre minimum de caractere accepter aprés le trim

//     // const needThreeCharac = (currentValue) => currentValue.length >= 3;
//     //
//     // if (tabToTrim.every(needThreeCharac) {
//     //   console.log('OK');
//     //   next();
//     // } else {
//     //   console.log('erreur');
//     //   //throw new Error('Minimum de 3 caractères dans chaque champs requis');
//     // }
//   } //test
// };
//Verification de la validité de l'email avec une Regex
// module.exports = (req, res, next) => {
//   if (JSON.parse(req.body.sauce !== undefined)) {
//     const sauceObject = JSON.parse(req.body.sauce);
//     let regex = new RegExp(/[a-zA-Z]+$/);
//   } else if (
//     regex.test(...sauceObject.name) &&
//     regex.test(...sauceObject.manufacturer) &&
//     regex.test(...sauceObject.description) &&
//     regex.test(...sauceObject.mainPepper)
//   ) {
//     next();
//     console.log('oskour');
//   }
// };
