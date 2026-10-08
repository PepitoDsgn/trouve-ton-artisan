const { Specialite, Categorie } = require('../models');

/**
 * Lists all specialties with their category, sorted by name (admin form).
 * @returns {Promise<Specialite[]>}
 */
const findAllSpecialites = () =>
  Specialite.findAll({
    include: [Categorie],
    order: [['nom', 'ASC']],
  });

module.exports = {
  findAllSpecialites,
};
