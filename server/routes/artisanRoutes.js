const express = require('express');
const {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
} = require('../controllers/artisanController');

const router = express.Router();

router.get('/du-mois', getArtisansDuMois);
router.get('/:id', getArtisanById);
router.get('/', getAllArtisans);

module.exports = router;
