const express = require('express');

const router = express.Router();

const userCtrl = require('../controllers/user');
const email = require('../middleware/verifEmail');
const password = require('../middleware/verifpassword');

router.post('/signup', email, password, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
