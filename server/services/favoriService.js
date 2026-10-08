const { Artisan, Specialite, Categorie, Favori } = require('../models');
const HttpError = require('../utils/httpError');

/**
 * Lists a member's favorite artisans, sorted by name.
 * @param {number} utilisateurId
 * @returns {Promise<Artisan[]>}
 */
const listerFavoris = async (utilisateurId) => {
  const favoris = await Favori.findAll({
    where: { utilisateurId },
    attributes: ['artisanId'],
  });

  return Artisan.findAll({
    where: { id: favoris.map((favori) => favori.artisanId) },
    include: [{ model: Specialite, include: [Categorie] }],
    order: [['nom', 'ASC']],
  });
};

/**
 * Adds an artisan to a member's favorites. Idempotent: adding it twice
 * does not create a duplicate.
 * @param {number} utilisateurId
 * @param {number} artisanId
 * @returns {Promise<void>}
 * @throws {HttpError} 404 if the artisan does not exist.
 */
const ajouterFavori = async (utilisateurId, artisanId) => {
  const artisan = await Artisan.findByPk(artisanId);
  if (!artisan) {
    throw new HttpError(404, 'Artisan introuvable');
  }
  await Favori.findOrCreate({ where: { utilisateurId, artisanId } });
};

/**
 * Removes an artisan from a member's favorites (no error if it was not one).
 * @param {number} utilisateurId
 * @param {number} artisanId
 * @returns {Promise<number>} Number of deleted rows (0 or 1).
 */
const retirerFavori = (utilisateurId, artisanId) =>
  Favori.destroy({ where: { utilisateurId, artisanId } });

module.exports = {
  listerFavoris,
  ajouterFavori,
  retirerFavori,
};
