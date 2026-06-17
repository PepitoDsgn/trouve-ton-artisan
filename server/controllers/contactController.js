const { Artisan } = require('../models');
const transporter = require('../config/mailer');

const sendContactMessage = async (req, res, next) => {
  try {
    const { nom, email, objet, message } = req.body;

    if (!nom || !email || !message) {
      return res.status(400).json({ message: 'Les champs nom, email et message sont obligatoires' });
    }

    const artisan = await Artisan.findByPk(req.params.id);

    if (!artisan) {
      return res.status(404).json({ message: 'Artisan introuvable' });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: artisan.email,
      replyTo: email,
      subject: objet || `Nouveau message de ${nom} via Trouve ton artisan`,
      text: `${message}\n\nContact : ${nom} (${email})`,
    });

    res.status(200).json({ message: 'Votre message a bien été envoyé' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendContactMessage,
};
