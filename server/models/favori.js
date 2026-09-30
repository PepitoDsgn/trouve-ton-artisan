const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Table de liaison utilisateur ↔ artisan (clé primaire composite)
const Favori = sequelize.define(
  'Favori',
  {
    utilisateurId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    artisanId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    tableName: 'favoris',
    updatedAt: false,
  }
);

module.exports = Favori;
