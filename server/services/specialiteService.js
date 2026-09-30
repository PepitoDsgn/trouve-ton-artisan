const { Specialite, Categorie } = require('../models');

const findAllSpecialites = () =>
  Specialite.findAll({
    include: [Categorie],
    order: [['nom', 'ASC']],
  });

module.exports = {
  findAllSpecialites,
};
