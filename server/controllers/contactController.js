const contactService = require('../services/contactService');

const sendContactMessage = async (req, res, next) => {
  try {
    const { nom, email, objet, message } = req.body;
    const sent = await contactService.sendContactMessage(
      req.params.id,
      req.utilisateur.id,
      { nom, email, objet, message }
    );

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
