const { Artisan } = require('../models');
const transporter = require('../config/mailer');

// Retourne false si l'artisan n'existe pas. L'email part en arrière-plan :
// un échec SMTP est journalisé sans bloquer la réponse au visiteur.
const sendContactMessage = async (artisanId, { nom, email, objet, message }) => {
  const artisan = await Artisan.findByPk(artisanId);

  if (!artisan) {
    return false;
  }

  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: artisan.email,
    replyTo: email,
    subject: objet || `Nouveau message de ${nom} via Trouve ton artisan`,
    text: `${message}\n\nContact : ${nom} (${email})`,
  }).catch((err) => console.error('Erreur envoi email :', err.message));

  return true;
};

module.exports = {
  sendContactMessage,
};
