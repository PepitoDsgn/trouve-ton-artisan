const favoriService = require('../services/favoriService');

const getFavoris = async (req, res, next) => {
  try {
    const artisans = await favoriService.listerFavoris(req.utilisateur.id);
    res.json(artisans);
  } catch (error) {
    next(error);
  }
};

const addFavori = async (req, res, next) => {
  try {
    await favoriService.ajouterFavori(req.utilisateur.id, req.params.artisanId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const removeFavori = async (req, res, next) => {
  try {
    await favoriService.retirerFavori(req.utilisateur.id, req.params.artisanId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavoris,
  addFavori,
  removeFavori,
};
