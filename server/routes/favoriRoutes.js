const express = require('express');
const { param } = require('express-validator');
const {
  getFavoris,
  addFavori,
  removeFavori,
} = require('../controllers/favoriController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

const artisanIdValidation = [
  param('artisanId').isInt({ min: 1 }).withMessage('Identifiant artisan invalide').toInt(),
];

router.use(requireAuth);

router.get('/', getFavoris);
router.put('/:artisanId', artisanIdValidation, validate, addFavori);
router.delete('/:artisanId', artisanIdValidation, validate, removeFavori);

module.exports = router;
