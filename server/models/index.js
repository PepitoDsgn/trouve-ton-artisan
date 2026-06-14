const sequelize = require('../config/database');
const Categorie = require('./categorie');
const Specialite = require('./specialite');
const Artisan = require('./artisan');

Categorie.hasMany(Specialite, { foreignKey: 'categorieId', onDelete: 'CASCADE' });
Specialite.belongsTo(Categorie, { foreignKey: 'categorieId' });

Specialite.hasMany(Artisan, { foreignKey: 'specialiteId', onDelete: 'CASCADE' });
Artisan.belongsTo(Specialite, { foreignKey: 'specialiteId' });

module.exports = {
  sequelize,
  Categorie,
  Specialite,
  Artisan,
};
