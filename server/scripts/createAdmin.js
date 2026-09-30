require('dotenv').config();
const { sequelize, Utilisateur } = require('../models');
const { creerOuMettreAJourAdmin } = require('../services/authService');

const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

const createAdmin = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error('ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env');
  }

  // Crée la table si elle n'existe pas encore, sans toucher aux données
  await Utilisateur.sync();
  const { admin, cree } = await creerOuMettreAJourAdmin({ email: ADMIN_EMAIL, motDePasse: ADMIN_PASSWORD });
  console.log(`Administrateur ${admin.email} ${cree ? 'créé' : 'mis à jour'}`);
  await sequelize.close();
};

createAdmin().catch((error) => {
  console.error("Erreur lors de la création de l'administrateur :", error.message);
  process.exit(1);
});
