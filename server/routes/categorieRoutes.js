const express = require('express');
const { getAllCategories } = require('../controllers/categorieController');

const router = express.Router();

router.get('/', getAllCategories);

module.exports = router;
