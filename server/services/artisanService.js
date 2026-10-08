const { Op } = require('sequelize');
const { Artisan, Specialite, Categorie } = require('../models');
const HttpError = require('../utils/httpError');

const MAX_ARTISANS_DU_MOIS = 3;

// Champs modifiables par l'admin : tout autre champ du corps de requête est ignoré
const CHAMPS_MODIFIABLES = [
  'nom',
  'description',
  'email',
  'telephone',
  'adresse',
  'ville',
  'codePostal',
  'image',
  'artisanDuMois',
  'specialiteId',
];

const extraireChamps = (donnees) =>
  Object.fromEntries(
    CHAMPS_MODIFIABLES.filter((champ) => donnees[champ] !== undefined).map((champ) => [champ, donnees[champ]])
  );

/**
 * Lists artisans sorted by name, with their specialty and category.
 * @param {{ categorie?: number|string, recherche?: string }} [filtres]
 *   categorie: category id to filter on; recherche: case-insensitive name search.
 * @returns {Promise<Artisan[]>} Artisans without their email address.
 */
const findAllArtisans = ({ categorie, recherche } = {}) => {
  const where = {};
  if (recherche) {
    where.nom = { [Op.like]: `%${recherche}%` };
  }

  const specialiteInclude = {
    model: Specialite,
    required: Boolean(categorie),
    include: [
      {
        model: Categorie,
        ...(categorie ? { where: { id: categorie }, required: true } : {}),
      },
    ],
  };

  return Artisan.findAll({
    where,
    include: [specialiteInclude],
    order: [['nom', 'ASC']],
    subQuery: false,
  });
};

/**
 * Finds one artisan with its specialty and category.
 * @param {number|string} id
 * @returns {Promise<Artisan|null>} null if not found. Email is excluded.
 */
const findArtisanById = (id) =>
  Artisan.findByPk(id, {
    include: [{ model: Specialite, include: [Categorie] }],
  });

/**
 * Same as findArtisanById, but includes the artisan's email. Admin form only.
 * @param {number|string} id
 * @returns {Promise<Artisan|null>}
 */
const findArtisanAvecEmailById = (id) =>
  Artisan.scope('avecEmail').findByPk(id, {
    include: [{ model: Specialite, include: [Categorie] }],
  });

/**
 * Lists the artisans of the month shown on the home page.
 * @returns {Promise<Artisan[]>} At most MAX_ARTISANS_DU_MOIS artisans.
 */
const findArtisansDuMois = () =>
  Artisan.findAll({
    where: { artisanDuMois: true },
    include: [{ model: Specialite, include: [Categorie] }],
    limit: MAX_ARTISANS_DU_MOIS,
  });

const verifierSpecialite = async (specialiteId) => {
  if (specialiteId === undefined) return;
  const specialite = await Specialite.findByPk(specialiteId);
  if (!specialite) {
    throw new HttpError(400, 'Spécialité inconnue');
  }
};

// L'accueil n'affiche que 3 artisans du mois : on refuse d'en désigner un 4e
const verifierLimiteArtisansDuMois = async (artisanDuMois, artisanId = null) => {
  if (!artisanDuMois) return;
  const where = { artisanDuMois: true };
  const total = await Artisan.count({ where });
  const dejaDuMois = artisanId && (await Artisan.count({ where: { ...where, id: artisanId } }));
  if (!dejaDuMois && total >= MAX_ARTISANS_DU_MOIS) {
    throw new HttpError(409, `Il y a déjà ${MAX_ARTISANS_DU_MOIS} artisans du mois`);
  }
};

/**
 * Creates an artisan from the whitelisted fields of the request body.
 * @param {object} donnees Request body (unknown fields such as id are ignored).
 * @returns {Promise<Artisan>} The created artisan.
 * @throws {HttpError} 400 if the specialty does not exist,
 *   409 if it would exceed the maximum number of artisans of the month.
 */
const creerArtisan = async (donnees) => {
  const champs = extraireChamps(donnees);
  await verifierSpecialite(champs.specialiteId);
  await verifierLimiteArtisansDuMois(champs.artisanDuMois);

  const artisan = await Artisan.create(champs);
  return findArtisanById(artisan.id);
};

/**
 * Partially updates an artisan (only the provided whitelisted fields).
 * @param {number|string} id
 * @param {object} donnees
 * @returns {Promise<Artisan|null>} The updated artisan, or null if not found.
 * @throws {HttpError} 400 unknown specialty, 409 artisan-of-the-month limit reached.
 */
const modifierArtisan = async (id, donnees) => {
  const artisan = await Artisan.findByPk(id);
  if (!artisan) return null;

  const champs = extraireChamps(donnees);
  await verifierSpecialite(champs.specialiteId);
  await verifierLimiteArtisansDuMois(champs.artisanDuMois, artisan.id);

  await artisan.update(champs);
  return findArtisanById(artisan.id);
};

/**
 * Deletes an artisan. Its favorites are removed by the ON DELETE CASCADE foreign key.
 * @param {number|string} id
 * @returns {Promise<boolean>} false if the artisan did not exist.
 */
const supprimerArtisan = async (id) => {
  const nbSupprimes = await Artisan.destroy({ where: { id } });
  return nbSupprimes > 0;
};

module.exports = {
  findAllArtisans,
  findArtisanById,
  findArtisanAvecEmailById,
  findArtisansDuMois,
  creerArtisan,
  modifierArtisan,
  supprimerArtisan,
};
