const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//On applique le validateur avant l'export
userSchema.plugin(uniqueValidator);
//On exporte le model
module.exports = mongoose.model('User', userSchema);
