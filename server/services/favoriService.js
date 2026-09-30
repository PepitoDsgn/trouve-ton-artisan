const { Artisan, Specialite, Categorie, Favori } = require('../models');
const HttpError = require('../utils/httpError');

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

// Idempotent : ajouter deux fois le même artisan ne crée pas de doublon
const ajouterFavori = async (utilisateurId, artisanId) => {
  const artisan = await Artisan.findByPk(artisanId);
  if (!artisan) {
    throw new HttpError(404, 'Artisan introuvable');
  }
  await Favori.findOrCreate({ where: { utilisateurId, artisanId } });
};

const retirerFavori = (utilisateurId, artisanId) =>
  Favori.destroy({ where: { utilisateurId, artisanId } });

module.exports = {
  listerFavoris,
  ajouterFavori,
  retirerFavori,
};
