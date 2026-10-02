const compteService = require('../services/compteService');
const { cookieNom, cookieOptions } = require('../config/auth');

const getMesDonnees = async (req, res, next) => {
  try {
    const donnees = await compteService.exporterDonnees(req.utilisateur.id);
    res.attachment('mes-donnees-trouve-ton-artisan.json');
    res.json(donnees);
  } catch (error) {
    next(error);
  }
};

const deleteMonCompte = async (req, res, next) => {
  try {
    await compteService.supprimerCompte(req.utilisateur.id, req.body.motDePasse);
    const { maxAge, ...options } = cookieOptions;
    res.clearCookie(cookieNom, options);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMesDonnees,
  deleteMonCompte,
};
