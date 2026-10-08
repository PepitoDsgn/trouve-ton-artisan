const authService = require('../services/authService');
const { cookieNom } = require('../config/auth');

/**
 * Express middleware: requires a valid session cookie.
 * Sets req.utilisateur ({ id, email, role }) or answers 401.
 */
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

/**
 * Express middleware: requires the "admin" role, otherwise answers 403.
 * Must be placed after requireAuth.
 */
const requireAdmin = (req, res, next) => {
  if (req.utilisateur?.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
