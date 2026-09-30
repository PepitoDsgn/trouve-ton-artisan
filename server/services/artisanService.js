const { Op } = require('sequelize');
const { Artisan, Specialite, Categorie } = require('../models');

const findAllArtisans = ({ categorie, recherche } = {}) => {
  const where = {};
  if (recherche) {
    where.nom = { [Op.like]: `%${recherche}%` };
  }

  const specialiteInclude = {
    model: Specialite,
    required: Boolean(categorie),
    include: [
      {
        model: Categorie,
        ...(categorie ? { where: { id: categorie }, required: true } : {}),
      },
    ],
  };

  return Artisan.findAll({
    where,
    include: [specialiteInclude],
    order: [['nom', 'ASC']],
    subQuery: false,
  });
};

const findArtisanById = (id) =>
  Artisan.findByPk(id, {
    include: [{ model: Specialite, include: [Categorie] }],
  });

const findArtisansDuMois = () =>
  Artisan.findAll({
    where: { artisanDuMois: true },
    include: [{ model: Specialite, include: [Categorie] }],
    limit: 3,
  });

module.exports = {
  findAllArtisans,
  findArtisanById,
  findArtisansDuMois,
};
