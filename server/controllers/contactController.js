const { validationResult } = require('express-validator');
const contactService = require('../services/contactService');

const sendContactMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { nom, email, objet, message } = req.body;
    const sent = await contactService.sendContactMessage(req.params.id, { nom, email, objet, message });

    if (!sent) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    res.status(200).json({ message: 'Votre message a bien été envoyé' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendContactMessage,
};
