const specialiteService = require('../services/specialiteService');

const getAllSpecialites = async (req, res, next) => {
  try {
    const specialites = await specialiteService.findAllSpecialites();
    res.json(specialites);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllSpecialites,
};
