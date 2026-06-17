-- ============================================================
-- Projet  : Trouve ton artisan !
-- Auteur  : TomPtz
-- Date    : 2026-06-17
-- Objet   : Création de la base de données et des tables
-- ============================================================

SET NAMES utf8mb4;

-- Suppression et recréation de la base de données
DROP DATABASE IF EXISTS trouve_ton_artisan;

CREATE DATABASE trouve_ton_artisan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trouve_ton_artisan;

-- Table des catégories
CREATE TABLE categories (
  id   INT          NOT NULL AUTO_INCREMENT,
  nom  VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des spécialités
CREATE TABLE specialites (
  id          INT          NOT NULL AUTO_INCREMENT,
  nom         VARCHAR(255) NOT NULL UNIQUE,
  categorieId INT          NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_specialite_categorie
    FOREIGN KEY (categorieId) REFERENCES categories(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des artisans
CREATE TABLE artisans (
  id             INT          NOT NULL AUTO_INCREMENT,
  nom            VARCHAR(255) NOT NULL,
  description    TEXT,
  email          VARCHAR(255) NOT NULL,
  telephone      VARCHAR(20),
  adresse        VARCHAR(255),
  ville          VARCHAR(255) NOT NULL,
  codePostal     VARCHAR(10),
  image          VARCHAR(500),
  artisanDuMois  TINYINT(1)   NOT NULL DEFAULT 0,
  specialiteId   INT          NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_artisan_du_mois (artisanDuMois),
  CONSTRAINT fk_artisan_specialite
    FOREIGN KEY (specialiteId) REFERENCES specialites(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
