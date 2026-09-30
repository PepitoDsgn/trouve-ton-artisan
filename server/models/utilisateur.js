const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define(
  'Utilisateur',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    motDePasse: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    tableName: 'utilisateurs',
    // Le hash du mot de passe n'est jamais renvoyé, sauf demande explicite
    defaultScope: {
      attributes: { exclude: ['motDePasse'] },
    },
    scopes: {
      avecMotDePasse: {},
    },
  }
);

module.exports = Utilisateur;
