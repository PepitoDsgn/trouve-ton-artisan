const authService = require('../services/authService');
const { cookieNom } = require('../config/auth');

const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[cookieNom];
    const utilisateur = token ? await authService.verifierToken(token) : null;

    if (!utilisateur) {
      return res.status(401).json({ message: 'Vous devez être connecté' });
    }

    req.utilisateur = utilisateur;
    next();
  } catch (error) {
    next(error);
  }
};

// À placer après requireAuth
const requireAdmin = (req, res, next) => {
  if (req.utilisateur?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
