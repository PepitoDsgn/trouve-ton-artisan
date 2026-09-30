const { Categorie } = require('../models');

const findAllCategories = () => Categorie.findAll({ order: [['nom', 'ASC']] });

module.exports = {
  findAllCategories,
};
