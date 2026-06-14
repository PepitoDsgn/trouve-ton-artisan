const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Specialite = sequelize.define(
  'Specialite',
  {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'specialites',
    timestamps: false,
  }
);

module.exports = Specialite;
