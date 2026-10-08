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

/**
 * Registers a new member account (role is always "user").
 * @param {{ email: string, motDePasse: string }} identifiants Validated, normalized input.
 * @returns {Promise<{ id: number, email: string, role: string }>} Public user data (no hash).
 * @throws {HttpError} 409 if the email is already used.
 */
const inscrire = async ({ email, motDePasse }) => {
  const existant = await Utilisateur.findOne({ where: { email } });
  if (existant) {
    throw new HttpError(409, 'Un compte existe déjà avec cet email');
  }

  const hash = await bcrypt.hash(motDePasse, SALT_ROUNDS);
  const utilisateur = await Utilisateur.create({ email, motDePasse: hash, role: 'user' });
  return versUtilisateurPublic(utilisateur);
};

/**
 * Checks credentials. Unknown email and wrong password give the same error,
 * and take the same time (comparison against a dummy hash).
 * @param {{ email: string, motDePasse: string }} identifiants
 * @returns {Promise<{ id: number, email: string, role: string }>}
 * @throws {HttpError} 401 if the credentials are invalid.
 */
const connecter = async ({ email, motDePasse }) => {
  const utilisateur = await Utilisateur.scope('avecMotDePasse').findOne({ where: { email } });
  const valide = await bcrypt.compare(motDePasse, utilisateur ? utilisateur.motDePasse : HASH_FACTICE);

  if (!utilisateur || !valide) {
    throw new HttpError(401, 'Email ou mot de passe incorrect');
  }
  return versUtilisateurPublic(utilisateur);
};

/**
 * Signs a session JWT ({ sub: user id, role }) valid for dureeSessionSecondes.
 * @param {{ id: number, role: string }} utilisateur
 * @returns {string}
 */
const genererToken = (utilisateur) =>
  jwt.sign({ sub: utilisateur.id, role: utilisateur.role }, jwtSecret, {
    expiresIn: dureeSessionSecondes,
  });

/**
 * Verifies a session JWT and reloads the user from the database, so that a
 * deleted account or a changed role takes effect immediately.
 * @param {string} token
 * @returns {Promise<{ id: number, email: string, role: string }|null>}
 *   null if the token is invalid, expired, or the account no longer exists.
 */
const verifierToken = async (token) => {
  try {
    const { sub } = jwt.verify(token, jwtSecret);
    const utilisateur = await Utilisateur.findByPk(sub);
    return utilisateur ? versUtilisateurPublic(utilisateur) : null;
  } catch {
    return null;
  }
};

/**
 * Creates the administrator account, or resets its password and role if it exists.
 * Used by `npm run create-admin` and the seed only (never exposed through the API).
 * @param {{ email: string, motDePasse: string }} identifiants
 * @returns {Promise<{ admin: object, cree: boolean }>}
 */
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
