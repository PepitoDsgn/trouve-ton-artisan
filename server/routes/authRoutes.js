const express = require('express');
const { body } = require('express-validator');
const {
  inscription,
  connexion,
  deconnexion,
  moi,
} = require('../controllers/authController');
const { getMesDonnees, deleteMonCompte } = require('../controllers/compteController');
const { requireAuth } = require('../middlewares/auth');
const { connexionLimiter, inscriptionLimiter } = require('../middlewares/rateLimiter');
const validate = require('../middlewares/validate');

const router = express.Router();

const emailValidation = body('email')
  .trim()
  .notEmpty().withMessage("L'email est obligatoire")
  .isEmail().withMessage('Email invalide')
  .normalizeEmail();

const inscriptionValidation = [
  emailValidation,
  body('motDePasse')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    // bcrypt ignore tout ce qui dépasse 72 octets
    .isByteLength({ max: 72 }).withMessage('Le mot de passe est trop long')
    .matches(/[a-zA-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre')
    .matches(/\d/).withMessage('Le mot de passe doit contenir au moins un chiffre'),
];

const connexionValidation = [
  emailValidation,
  body('motDePasse').notEmpty().withMessage('Le mot de passe est obligatoire'),
];

router.post('/inscription', inscriptionLimiter, inscriptionValidation, validate, inscription);
router.post('/connexion', connexionLimiter, connexionValidation, validate, connexion);
router.post('/deconnexion', deconnexion);
router.get('/moi', requireAuth, moi);
router.get('/moi/donnees', requireAuth, getMesDonnees);
// Même limite que la connexion : empêche de deviner le mot de passe par ce biais
router.delete(
  '/moi',
  requireAuth,
  connexionLimiter,
  body('motDePasse').notEmpty().withMessage('Le mot de passe est obligatoire'),
  validate,
  deleteMonCompte
);

module.exports = router;
