require('dotenv').config();
const { sequelize, Categorie, Specialite, Artisan } = require('./models');

const seed = async () => {
  await sequelize.sync({ force: true });

  const categories = await Categorie.bulkCreate([
    { nom: 'Bâtiment' },
    { nom: 'Services' },
    { nom: 'Fabrication' },
    { nom: 'Alimentation' },
  ]);

  const getCategorieId = (nom) => categories.find((c) => c.nom === nom).id;

  const specialites = await Specialite.bulkCreate([
    { nom: 'Maçon', categorieId: getCategorieId('Bâtiment') },
    { nom: 'Électricien', categorieId: getCategorieId('Bâtiment') },
    { nom: 'Plombier', categorieId: getCategorieId('Bâtiment') },
    { nom: 'Coiffeur', categorieId: getCategorieId('Services') },
    { nom: 'Fleuriste', categorieId: getCategorieId('Services') },
    { nom: 'Ébéniste', categorieId: getCategorieId('Fabrication') },
    { nom: 'Bijoutier', categorieId: getCategorieId('Fabrication') },
    { nom: 'Boulanger', categorieId: getCategorieId('Alimentation') },
    { nom: 'Charcutier', categorieId: getCategorieId('Alimentation') },
  ]);

  const getSpecialiteId = (nom) => specialites.find((s) => s.nom === nom).id;

  await Artisan.bulkCreate([
    {
      nom: 'Maçonnerie Dupont',
      description: 'Construction et rénovation de bâtiments en pierre et béton.',
      email: 'contact@maconnerie-dupont.fr',
      telephone: '0470000001',
      adresse: '12 rue des Tilleuls',
      ville: 'Clermont-Ferrand',
      codePostal: '63000',
      image: 'https://loremflickr.com/600/400/masonry,construction?lock=1',
      specialiteId: getSpecialiteId('Maçon'),
      artisanDuMois: true,
    },
    {
      nom: 'Électricité Bernard',
      description: 'Installations électriques pour particuliers et professionnels.',
      email: 'contact@electricite-bernard.fr',
      telephone: '0470000002',
      adresse: '5 avenue de la République',
      ville: 'Lyon',
      codePostal: '69000',
      image: 'https://loremflickr.com/600/400/electricity,wiring?lock=2',
      specialiteId: getSpecialiteId('Électricien'),
      artisanDuMois: false,
    },
    {
      nom: 'Plomberie Moreau',
      description: 'Dépannage et installation sanitaire.',
      email: 'contact@plomberie-moreau.fr',
      telephone: '0470000003',
      adresse: '8 rue Victor Hugo',
      ville: 'Grenoble',
      codePostal: '38000',
      image: 'https://loremflickr.com/600/400/pipe,plumbing?lock=3',
      specialiteId: getSpecialiteId('Plombier'),
      artisanDuMois: true,
    },
    {
      nom: 'Salon Coiff Création',
      description: 'Coiffure homme, femme et enfant.',
      email: 'contact@coiff-creation.fr',
      telephone: '0470000004',
      adresse: '3 place Bellecour',
      ville: 'Lyon',
      codePostal: '69002',
      image: 'https://loremflickr.com/600/400/scissors,hair?lock=4',
      specialiteId: getSpecialiteId('Coiffeur'),
      artisanDuMois: false,
    },
    {
      nom: 'Fleurs des Monts',
      description: 'Compositions florales et fleurs de saison.',
      email: 'contact@fleurs-des-monts.fr',
      telephone: '0470000005',
      adresse: '20 rue de la Paix',
      ville: 'Annecy',
      codePostal: '74000',
      image: 'https://loremflickr.com/600/400/florist,flowers?lock=5',
      specialiteId: getSpecialiteId('Fleuriste'),
      artisanDuMois: false,
    },
    {
      nom: 'Atelier Bois & Sens',
      description: 'Fabrication de meubles sur mesure en bois massif.',
      email: 'contact@atelier-bois-sens.fr',
      telephone: '0470000006',
      adresse: '1 chemin des Artisans',
      ville: 'Valence',
      codePostal: '26000',
      image: 'https://loremflickr.com/600/400/wood,workshop?lock=6',
      specialiteId: getSpecialiteId('Ébéniste'),
      artisanDuMois: true,
    },
    {
      nom: 'Bijouterie Lacroix',
      description: 'Création et réparation de bijoux.',
      email: 'contact@bijouterie-lacroix.fr',
      telephone: '0470000007',
      adresse: '15 rue du Commerce',
      ville: 'Saint-Étienne',
      codePostal: '42000',
      image: 'https://loremflickr.com/600/400/jeweler,jewelry?lock=7',
      specialiteId: getSpecialiteId('Bijoutier'),
      artisanDuMois: false,
    },
    {
      nom: 'Boulangerie du Centre',
      description: 'Pain et viennoiseries artisanales, fabrication maison chaque jour.',
      email: 'contact@boulangerie-du-centre.fr',
      telephone: '0470000008',
      adresse: '2 place du Marché',
      ville: 'Chambéry',
      codePostal: '73000',
      image: 'https://loremflickr.com/600/400/bakery,bread?lock=8',
      specialiteId: getSpecialiteId('Boulanger'),
      artisanDuMois: false,
    },
    {
      nom: 'Charcuterie des Alpes',
      description: 'Charcuterie traditionnelle et produits locaux.',
      email: 'contact@charcuterie-des-alpes.fr',
      telephone: '0470000009',
      adresse: '7 rue des Bouchers',
      ville: 'Annonay',
      codePostal: '07100',
      image: 'https://loremflickr.com/600/400/butcher,charcuterie?lock=9',
      specialiteId: getSpecialiteId('Charcutier'),
      artisanDuMois: false,
    },
  ]);

  console.log('Données de test insérées avec succès');
  await sequelize.close();
};

seed().catch((error) => {
  console.error("Erreur lors de l'insertion des données de test :", error);
  process.exit(1);
});
