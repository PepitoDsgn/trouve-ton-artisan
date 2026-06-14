const express = require('express');
const {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
} = require('../controllers/artisanController');
const { sendContactMessage } = require('../controllers/contactController');

const router = express.Router();

router.get('/du-mois', getArtisansDuMois);
router.get('/:id', getArtisanById);
router.get('/', getAllArtisans);
router.post('/:id/contact', sendContactMessage);

module.exports = router;
