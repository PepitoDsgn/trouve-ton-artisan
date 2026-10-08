const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../models');
const Message = require('../models/mongo/message');
const { listerFavoris } = require('./favoriService');
const HttpError = require('../utils/httpError');

/**
 * GDPR right of access (art. 15): exports all data linked to an account.
 * @param {number} utilisateurId
 * @returns {Promise<{ compte: object, favoris: object[], messagesEnvoyes: object[] }>}
 *   Never contains the password hash.
 */
const exporterDonnees = async (utilisateurId) => {
  const [utilisateur, favoris, messages] = await Promise.all([
    Utilisateur.findByPk(utilisateurId),
    listerFavoris(utilisateurId),
    Message.find({ utilisateurId }).sort({ createdAt: -1 }).lean(),
  ]);

  return {
    compte: {
      email: utilisateur.email,
      role: utilisateur.role,
      creeLe: utilisateur.createdAt,
    },
    favoris: favoris.map(({ id, nom, ville }) => ({ id, nom, ville })),
    messagesEnvoyes: messages.map(({ artisan, nom, email, objet, message, createdAt }) => ({
      artisan: artisan.nom,
      nom,
      email,
      objet,
      message,
      envoyeLe: createdAt,
    })),
  };
};

/**
 * GDPR right to erasure (art. 17): deletes the account, its favorites and
 * the contact messages it sent. The password is required again.
 * @param {number} utilisateurId
 * @param {string} motDePasse
 * @returns {Promise<void>}
 * @throws {HttpError} 401 wrong password, 403 administrator account.
 */
// Droit à l'effacement (RGPD art. 17). Le mot de passe est redemandé pour
// qu'une session laissée ouverte ne suffise pas à supprimer le compte.
const supprimerCompte = async (utilisateurId, motDePasse) => {
  const utilisateur = await Utilisateur.scope('avecMotDePasse').findByPk(utilisateurId);

  if (!(await bcrypt.compare(motDePasse, utilisateur.motDePasse))) {
    throw new HttpError(401, 'Mot de passe incorrect');
  }
  if (utilisateur.role === 'admin') {
    throw new HttpError(403, 'Le compte administrateur ne peut pas être supprimé depuis le site');
  }

  // Messages d'abord : en cas d'échec MongoDB, le compte existe encore et
  // l'utilisateur peut recommencer, sans laisser de messages orphelins.
  await Message.deleteMany({ utilisateurId });
  // Les favoris sont supprimés en cascade par la clé étrangère
  await utilisateur.destroy();
};

module.exports = {
  exporterDonnees,
  supprimerCompte,
};
