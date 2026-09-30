const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models');
const { jwtSecret, dureeSessionSecondes } = require('../config/auth');
const HttpError = require('../utils/httpError');

const SALT_ROUNDS = 12;

// Hash factice comparé quand l'email est inconnu : la réponse prend le même
// temps qu'un mauvais mot de passe, ce qui évite de deviner les comptes existants.
const HASH_FACTICE = bcrypt.hashSync('mot-de-passe-factice', SALT_ROUNDS);

const versUtilisateurPublic = ({ id, email, role }) => ({ id, email, role });

const inscrire = async ({ email, motDePasse }) => {
  const existant = await Utilisateur.findOne({ where: { email } });
  if (existant) {
    throw new HttpError(409, 'Un compte existe déjà avec cet email');
  }

  const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);
  const utilisateur = await Utilisateur.create({ email, motDePasse: hash, role: 'user' });
  return versUtilisateurPublic(utilisateur);
};

const connecter = async ({ email, motDePasse }) => {
  const utilisateur = await Utilisateur.scope('avecMotDePasse').findOne({ where: { email } });
  const valide = await bcrypt.compare(motDePasse, utilisateur ? utilisateur.motDePasse : HASH_FACTICE);

  if (!utilisateur || !valide) {
    throw new HttpError(401, 'Email ou mot de passe incorrect');
  }
  return versUtilisateurPublic(utilisateur);
};

const genererToken = (utilisateur) =>
  jwt.sign({ sub: utilisateur.id, role: utilisateur.role }, jwtSecret, {
    expiresIn: dureeSessionSecondes,
  });

// Retourne l'utilisateur du token, ou null si le token est invalide, expiré
// ou si le compte n'existe plus.
const verifierToken = async (token) => {
  try {
    const { sub } = jwt.verify(token, jwtSecret);
    const utilisateur = await Utilisateur.findByPk(sub);
    return utilisateur ? versUtilisateurPublic(utilisateur) : null;
  } catch {
    return null;
  }
};

const creerOuMettreAJourAdmin = async ({ email, motDePasse }) => {
  const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);
  const [admin, cree] = await Utilisateur.findOrCreate({
    where: { email },
    defaults: { motDePasse: hash, role: 'admin' },
  });
  if (!cree) {
    await admin.update({ motDePasse: hash, role: 'admin' });
  }
  return { admin: versUtilisateurPublic(admin), cree };
};

module.exports = {
  inscrire,
  connecter,
  genererToken,
  verifierToken,
  creerOuMettreAJourAdmin,
};
