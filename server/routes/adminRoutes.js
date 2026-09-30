const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createArtisan,
  updateArtisan,
  deleteArtisan,
} = require('../controllers/artisanController');
const { getAllSpecialites } = require('../controllers/specialiteController');
const {
  getMessages,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { requireAuth, requireAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = express.Router();

// Toutes les routes admin : connecté ET rôle admin
router.use(requireAuth, requireAdmin);

const idValidation = param('id').isInt({ min: 1 }).withMessage('Identifiant invalide').toInt();

// Création : nom, email, ville et spécialité obligatoires.
// Modification : tous les champs sont facultatifs, mais validés s'ils sont fournis.
const artisanValidation = (creation) => {
  const champ = (nom) => (creation ? body(nom) : body(nom).optional());

  return [
    champ('nom').trim().notEmpty().withMessage('Le nom est obligatoire').isLength({ max: 255 }),
    champ('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
    champ('ville').trim().notEmpty().withMessage('La ville est obligatoire').isLength({ max: 255 }),
    champ('specialiteId').isInt({ min: 1 }).withMessage('La spécialité est obligatoire').toInt(),
    body('description').optional({ values: 'null' }).trim().isLength({ max: 2000 }),
    body('telephone').optional({ values: 'falsy' }).trim()
      .matches(/^0\d{9}$/).withMessage('Le téléphone doit contenir 10 chiffres et commencer par 0'),
    body('adresse').optional({ values: 'null' }).trim().isLength({ max: 255 }),
    body('codePostal').optional({ values: 'falsy' }).trim()
      .matches(/^\d{5}$/).withMessage('Le code postal doit contenir 5 chiffres'),
    body('image').optional({ values: 'falsy' }).trim().isLength({ max: 500 })
      .matches(/^(https:\/\/|\/images\/)/).withMessage("L'image doit être une URL https ou un chemin /images/..."),
    body('artisanDuMois').optional().isBoolean().withMessage('Valeur invalide').toBoolean(),
  ];
};

router.get('/specialites', getAllSpecialites);

router.post('/artisans', artisanValidation(true), validate, createArtisan);
router.put('/artisans/:id', idValidation, artisanValidation(false), validate, updateArtisan);
router.delete('/artisans/:id', idValidation, validate, deleteArtisan);

const messageIdValidation = param('id').isMongoId().withMessage('Identifiant de message invalide');

router.get(
  '/messages',
  query('lu').optional().isBoolean().withMessage('Filtre invalide').toBoolean(),
  validate,
  getMessages
);
router.patch(
  '/messages/:id',
  messageIdValidation,
  body('lu').isBoolean().withMessage('Le champ lu doit être un booléen').toBoolean(),
  validate,
  updateMessage
);
router.delete('/messages/:id', messageIdValidation, validate, deleteMessage);

module.exports = router;
