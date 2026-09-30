const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    // On ne renvoie pas la valeur saisie : elle peut contenir un mot de passe
    const errors = result.array().map(({ path, msg }) => ({ champ: path, message: msg }));
    return res.status(400).json({ message: errors[0].message, errors });
  }
  next();
};

module.exports = validate;
