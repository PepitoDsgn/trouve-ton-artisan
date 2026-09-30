const categorieService = require('../services/categorieService');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categorieService.findAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
};
