const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de messages envoyés, veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Seuls les échecs sont comptés : un utilisateur légitime n'est pas bloqué
const connexionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const inscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de comptes créés, veuillez réessayer plus tard.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { contactLimiter, connexionLimiter, inscriptionLimiter };
