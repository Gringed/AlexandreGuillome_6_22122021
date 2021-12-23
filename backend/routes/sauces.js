const express = require('express');

const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.createSauce);

router.post('/:id/like', auth, multer, saucesCtrl.likedSauce);

router.put('/:id', auth, multer, saucesCtrl.modifySauce);

router.delete('/:id', auth, multer, saucesCtrl.deleteSauce)

router.get('/:id', auth, multer, saucesCtrl.findOneSauce)

router.get('/', auth, saucesCtrl.findAllSauces);

module.exports = router;