const { Sequelize } = require('sequelize');
const request = require('supertest');
const app = require('../app');
const { sequelize, Categorie, Specialite, Artisan } = require('../models');
const { mongoose } = require('../config/mongo');
const Message = require('../models/mongo/message');
const { inscrire, creerOuMettreAJourAdmin } = require('../services/authService');

const MOT_DE_PASSE = 'motdepasse1';

if (!process.env.DB_NAME.endsWith('_test')) {
  throw new Error('Les tests doivent tourner sur une base *_test');
}

// Crée la base MariaDB de test si elle n'existe pas encore
const creerBaseDeTest = async () => {
  const serveur = new Sequelize('', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    dialect: 'mysql',
    logging: false,
  });
  await serveur.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await serveur.close();
};

// Base vide + jeu de données minimal et connu : 2 catégories, 2 spécialités,
// 3 artisans dont 1 artisan du mois
const initialiserBase = async () => {
  await creerBaseDeTest();
  await sequelize.sync({ force: true });
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
  await Message.syncIndexes();
  await Message.deleteMany({});

  const [batiment, alimentation] = await Categorie.bulkCreate([
    { nom: 'Bâtiment' },
    { nom: 'Alimentation' },
  ]);
  const [macon, boulanger] = await Specialite.bulkCreate([
    { nom: 'Maçon', categorieId: batiment.id },
    { nom: 'Boulanger', categorieId: alimentation.id },
  ]);
  const artisans = await Artisan.bulkCreate([
    { nom: 'Maçonnerie Dupont', email: 'dupont@example.com', ville: 'Lyon', specialiteId: macon.id, artisanDuMois: true },
    { nom: 'Bâti Martin', email: 'martin@example.com', ville: 'Grenoble', specialiteId: macon.id },
    { nom: 'Boulangerie Durand', email: 'durand@example.com', ville: 'Annecy', specialiteId: boulanger.id },
  ]);

  return { categories: { batiment, alimentation }, specialites: { macon, boulanger }, artisans };
};

const fermerConnexions = async () => {
  await sequelize.close();
  await mongoose.disconnect();
};

// Agent Supertest qui garde le cookie de session entre les requêtes
const agentConnecte = async (email, motDePasse = MOT_DE_PASSE) => {
  const agent = request.agent(app);
  const res = await agent.post('/api/auth/connexion').send({ email, motDePasse });
  if (res.status !== 200) throw new Error(`Connexion impossible pour ${email} : ${res.status}`);
  return agent;
};

const creerMembre = async (email = 'membre@exemple.fr') => {
  await inscrire({ email, motDePasse: MOT_DE_PASSE });
  return agentConnecte(email);
};

const creerAdmin = async (email = 'admin@exemple.fr') => {
  await creerOuMettreAJourAdmin({ email, motDePasse: MOT_DE_PASSE });
  return agentConnecte(email);
};

module.exports = {
  app,
  request,
  MOT_DE_PASSE,
  initialiserBase,
  fermerConnexions,
  agentConnecte,
  creerMembre,
  creerAdmin,
};
