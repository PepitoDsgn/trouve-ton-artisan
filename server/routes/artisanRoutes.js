const express = require('express');
const { body } = require('express-validator');
const {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
} = require('../controllers/artisanController');
const { sendContactMessage } = require('../controllers/contactController');
const { contactLimiter } = require('../middlewares/rateLimiter');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

const contactValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ max: 100 }).withMessage('Le nom ne doit pas dépasser 100 caractères'),
  body('email').trim().notEmpty().withMessage("L'email est obligatoire").isEmail().withMessage('Email invalide').normalizeEmail(),
  body('objet').optional({ checkFalsy: true }).trim().isLength({ max: 150 }).withMessage("L'objet ne doit pas dépasser 150 caractères"),
  body('message').trim().notEmpty().withMessage('Le message est obligatoire').isLength({ max: 2000 }).withMessage('Le message ne doit pas dépasser 2000 caractères'),
];

// Toutes les routes artisans sont réservées aux membres connectés
router.use(requireAuth);

router.get('/du-mois', getArtisansDuMois);
router.get('/:id', getArtisanById);
router.get('/', getAllArtisans);
router.post('/:id/contact', contactLimiter, contactValidation, validate, sendContactMessage);

module.exports = router;
