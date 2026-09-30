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

const findArtisanById = (id) =>
  Artisan.findByPk(id, {
    include: [{ model: Specialite, include: [Categorie] }],
  });

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

const creerArtisan = async (donnees) => {
  const champs = extraireChamps(donnees);
  await verifierSpecialite(champs.specialiteId);
  await verifierLimiteArtisansDuMois(champs.artisanDuMois);

  const artisan = await Artisan.create(champs);
  return findArtisanById(artisan.id);
};

// Retourne null si l'artisan n'existe pas
const modifierArtisan = async (id, donnees) => {
  const artisan = await Artisan.findByPk(id);
  if (!artisan) return null;

  const champs = extraireChamps(donnees);
  await verifierSpecialite(champs.specialiteId);
  await verifierLimiteArtisansDuMois(champs.artisanDuMois, artisan.id);

  await artisan.update(champs);
  return findArtisanById(artisan.id);
};

// Retourne false si l'artisan n'existe pas. Ses favoris sont supprimés en cascade.
const supprimerArtisan = async (id) => {
  const nbSupprimes = await Artisan.destroy({ where: { id } });
  return nbSupprimes > 0;
};

module.exports = {
  findAllArtisans,
  findArtisanById,
  findArtisansDuMois,
  creerArtisan,
  modifierArtisan,
  supprimerArtisan,
};
