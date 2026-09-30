// Erreur métier portant son code HTTP, traduite en réponse par errorHandler
class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = HttpError;
