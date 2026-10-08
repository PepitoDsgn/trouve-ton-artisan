const { Categorie } = require('../models');

/**
 * Lists all categories sorted by name (public: used by the navigation menu).
 * @returns {Promise<Categorie[]>}
 */
const findAllCategories = () => Categorie.findAll({ order: [['nom', 'ASC']] });

module.exports = {
  findAllCategories,
};
