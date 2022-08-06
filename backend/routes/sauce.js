const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const router = express.Router();
const testMulter = require('../middleware/multer-config-modify');
const sauceCtrl = require('../controllers/sauce');
// const verifForm = require('../middleware/verifFormSauce');

router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.post('/', auth, testMulter, sauceCtrl.createSauce);
router.put('/:id', auth, testMulter, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

router.post('/:id/like', auth, sauceCtrl.likesDislikesSauce);

module.exports = router;
