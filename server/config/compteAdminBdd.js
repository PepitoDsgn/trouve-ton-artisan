// Les scripts qui modifient la structure de la base (seed, création de l'admin,
// tests) utilisent le compte d'administration MariaDB. L'application, elle,
// tourne avec DB_USER, qui n'a que les droits de lecture et d'écriture.
// À appeler avant le premier require('../models').
const utiliserCompteAdminBdd = () => {
  if (process.env.DB_ADMIN_USER) {
    process.env.DB_USER = process.env.DB_ADMIN_USER;
    process.env.DB_PASSWORD = process.env.DB_ADMIN_PASSWORD || '';
  }
};

module.exports = utiliserCompteAdminBdd;
