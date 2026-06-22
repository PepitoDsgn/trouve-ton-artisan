const express = require('express');
const { body } = require('express-validator');
const {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
} = require('../controllers/artisanController');
const { sendContactMessage } = require('../controllers/contactController');
const { contactLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

const contactValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ max: 100 }),
  body('email').trim().notEmpty().withMessage("L'email est obligatoire").isEmail().withMessage('Email invalide').normalizeEmail(),
  body('objet').optional({ checkFalsy: true }).trim().isLength({ max: 150 }),
  body('message').trim().notEmpty().withMessage('Le message est obligatoire').isLength({ max: 2000 }),
];

router.get('/du-mois', getArtisansDuMois);
router.get('/:id', getArtisanById);
router.get('/', getAllArtisans);
router.post('/:id/contact', contactLimiter, contactValidation, sendContactMessage);

module.exports = router;
