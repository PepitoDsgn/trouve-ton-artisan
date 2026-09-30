const artisanService = require('../services/artisanService');

const getAllArtisans = async (req, res, next) => {
  try {
    const { categorie, recherche } = req.query;
    const artisans = await artisanService.findAllArtisans({ categorie, recherche });
    res.json(artisans);
  } catch (error) {
    next(error);
  }
};

const getArtisanById = async (req, res, next) => {
  try {
    const artisan = await artisanService.findArtisanById(req.params.id);

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
    const artisans = await artisanService.findArtisansDuMois();
    res.json(artisans);
  } catch (error) {
    next(error);
  }
};

const createArtisan = async (req, res, next) => {
  try {
    const artisan = await artisanService.creerArtisan(req.body);
    res.status(201).json(artisan);
  } catch (error) {
    next(error);
  }
};

const updateArtisan = async (req, res, next) => {
  try {
    const artisan = await artisanService.modifierArtisan(req.params.id, req.body);

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    res.json(artisan);
  } catch (error) {
    next(error);
  }
};

const deleteArtisan = async (req, res, next) => {
  try {
    const supprime = await artisanService.supprimerArtisan(req.params.id);

    if (!supprime) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArtisans,
  getArtisanById,
  getArtisansDuMois,
  createArtisan,
  updateArtisan,
  deleteArtisan,
};
