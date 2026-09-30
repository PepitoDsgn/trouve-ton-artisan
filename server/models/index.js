const sequelize = require('../config/database');
const Categorie = require('./categorie');
const Specialite = require('./specialite');
const Artisan = require('./artisan');
const Utilisateur = require('./utilisateur');
const Favori = require('./favori');

Categorie.hasMany(Specialite, { foreignKey: 'categorieId', onDelete: 'CASCADE' });
Specialite.belongsTo(Categorie, { foreignKey: 'categorieId' });

Specialite.hasMany(Artisan, { foreignKey: 'specialiteId', onDelete: 'CASCADE' });
Artisan.belongsTo(Specialite, { foreignKey: 'specialiteId' });

Utilisateur.belongsToMany(Artisan, {
  through: Favori,
  as: 'favoris',
  foreignKey: 'utilisateurId',
  otherKey: 'artisanId',
  onDelete: 'CASCADE',
});
Artisan.belongsToMany(Utilisateur, {
  through: Favori,
  foreignKey: 'artisanId',
  otherKey: 'utilisateurId',
  onDelete: 'CASCADE',
});

module.exports = {
  sequelize,
  Categorie,
  Specialite,
  Artisan,
  Utilisateur,
  Favori,
};
