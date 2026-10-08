-- ============================================================
-- Projet  : Trouve ton artisan !
-- Objet   : Compte MariaDB de l'application (principe du moindre privilège)
-- ============================================================
-- L'application n'a besoin que de lire et d'écrire des données : elle ne peut
-- ni créer, ni modifier, ni supprimer de tables, ni accéder à une autre base.
-- La structure (create_database.sql, npm run seed) est gérée avec un compte
-- d'administration distinct.
--
-- Avant exécution, remplacer CHANGER_CE_MOT_DE_PASSE par un mot de passe fort,
-- identique à DB_PASSWORD dans server/.env.

CREATE USER IF NOT EXISTS 'tta_app'@'localhost' IDENTIFIED BY 'CHANGER_CE_MOT_DE_PASSE';
CREATE USER IF NOT EXISTS 'tta_app'@'127.0.0.1' IDENTIFIED BY 'CHANGER_CE_MOT_DE_PASSE';

GRANT SELECT, INSERT, UPDATE, DELETE ON trouve_ton_artisan.* TO 'tta_app'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON trouve_ton_artisan.* TO 'tta_app'@'127.0.0.1';

FLUSH PRIVILEGES;
