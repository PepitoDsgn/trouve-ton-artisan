const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
  // Les erreurs 4xx sont prévues (mauvais mot de passe, doublon...) : seules
  // les erreurs serveur sont journalisées
  if (statusCode >= 500) console.error(err);
  const message = statusCode < 500 ? err.message : 'Erreur interne du serveur';
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
