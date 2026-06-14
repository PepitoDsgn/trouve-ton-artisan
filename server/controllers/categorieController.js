const { Categorie } = require('../models');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Categorie.findAll({ order: [['nom', 'ASC']] });
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
};
