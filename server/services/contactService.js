const { Artisan } = require('../models');
const Message = require('../models/mongo/message');
const transporter = require('../config/mailer');

/**
 * Stores a contact message in MongoDB, then emails it to the artisan.
 * The artisan's email is only read here, server-side.
 * @param {number|string} artisanId
 * @param {number} utilisateurId Logged-in member who sends the message.
 * @param {{ nom: string, email: string, objet?: string, message: string }} contenu
 * @returns {Promise<boolean>} false if the artisan does not exist.
 */
// Retourne false si l'artisan n'existe pas. Le message est d'abord enregistré
// dans MongoDB ; l'email part ensuite en arrière-plan : un échec SMTP est
// journalisé sans bloquer la réponse au visiteur, et le message reste consultable.
const sendContactMessage = async (artisanId, utilisateurId, { nom, email, objet, message }) => {
  const artisan = await Artisan.scope('avecEmail').findByPk(artisanId);

  if (!artisan) {
    return false;
  }

  await Message.create({
    artisan: { id: artisan.id, nom: artisan.nom },
    utilisateurId,
    nom,
    email,
    objet,
    message,
  });

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
