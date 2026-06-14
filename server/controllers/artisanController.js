const { Op } = require('sequelize');
const { Artisan, Specialite, Categorie } = require('../models');

const getAllArtisans = async (req, res, next) => {
  try {
    const { categorie, recherche } = req.query;

    const where = {};
    if (recherche) {
      where.nom = { [Op.like]: `%${recherche}%` };
    }

    const specialiteInclude = {
      model: Specialite,
      include: [
        {
          model: Categorie,
          ...(categorie ? { where: { id: categorie }, required: true } : {}),
        },
      ],
    };

    const artisans = await Artisan.findAll({
      where,
      include: [specialiteInclude],
      order: [['nom', 'ASC']],
    });

    res.json(artisans);
  } catch (error) {
    next(error);
  }
};

const getArtisanById = async (req, res, next) => {
  try {
    const artisan = await Artisan.findByPk(req.params.id, {
      include: [{ model: Specialite, include: [Categorie] }],
    });

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    res.json(artisan);
  } catch (error) {
    next(error);
  }
};

const getArtisansDuMois = async (req, res, next) => {
  try {
    const artisans = await Artisan.findAll({
      where: { artisanDuMois: true },
      include: [{ model: Specialite, include: [Categorie] }],
      limit: 3,
    });

    res.json(artisans);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
};
