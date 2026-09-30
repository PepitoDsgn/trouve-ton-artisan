const authService = require('../services/authService');
const { cookieNom, cookieOptions } = require('../config/auth');

const ouvrirSession = (res, utilisateur) => {
  res.cookie(cookieNom, authService.genererToken(utilisateur), cookieOptions);
};

const inscription = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await authService.inscrire({ email, motDePasse });
    ouvrirSession(res, utilisateur);
    res.status(201).json({ utilisateur });
  } catch (error) {
    next(error);
  }
};

const connexion = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;
    const utilisateur = await authService.connecter({ email, motDePasse });
    ouvrirSession(res, utilisateur);
    res.json({ utilisateur });
  } catch (error) {
    next(error);
  }
};

const deconnexion = (req, res) => {
  const { maxAge, ...options } = cookieOptions;
  res.clearCookie(cookieNom, options);
  res.status(204).end();
};

const moi = (req, res) => {
  res.json({ utilisateur: req.utilisateur });
};

module.exports = {
  inscription,
  connexion,
  deconnexion,
  moi,
};
