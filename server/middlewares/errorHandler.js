const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode && err.statusCode < 500 ? err.statusCode : 500;
  const message = statusCode < 500 ? err.message : 'Erreur interne du serveur';
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
