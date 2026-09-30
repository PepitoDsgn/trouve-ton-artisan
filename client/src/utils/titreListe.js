const titresCategorie = {
  Bâtiment: 'Les Artisans du Bâtiment',
  Services: 'Les Artisans du Service',
  Fabrication: 'Les Artisans en Fabrication',
  Alimentation: "Les Artisans de l'Alimentaire",
};

export const getTitreListe = ({ categorieId, categorie, recherche }) => {
  if (categorieId) {
    return categorie
      ? titresCategorie[categorie.nom] || `Les Artisans – ${categorie.nom}`
      : 'Nos Artisans';
  }
  return recherche ? `Résultats pour "${recherche}"` : 'Nos Artisans';
};
