const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../models');
const Message = require('../models/mongo/message');
const { listerFavoris } = require('./favoriService');
const HttpError = require('../utils/httpError');

// Droit d'accès (RGPD art. 15) : toutes les données liées au compte
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
