-- ============================================================
-- Projet  : Trouve ton artisan !
-- Auteur  : TomPtz
-- Date    : 2026-06-17
-- Objet   : Alimentation de la base de données (données de démo)
-- ============================================================

SET NAMES utf8mb4;

USE trouve_ton_artisan;

START TRANSACTION;

-- Catégories
INSERT INTO categories (nom) VALUES
  ('Bâtiment'),
  ('Services'),
  ('Fabrication'),
  ('Alimentation');

-- Spécialités
INSERT INTO specialites (nom, categorieId) VALUES
  ('Maçon',       (SELECT id FROM categories WHERE nom = 'Bâtiment')),
  ('Électricien', (SELECT id FROM categories WHERE nom = 'Bâtiment')),
  ('Plombier',    (SELECT id FROM categories WHERE nom = 'Bâtiment')),
  ('Coiffeur',    (SELECT id FROM categories WHERE nom = 'Services')),
  ('Fleuriste',   (SELECT id FROM categories WHERE nom = 'Services')),
  ('Ébéniste',    (SELECT id FROM categories WHERE nom = 'Fabrication')),
  ('Bijoutier',   (SELECT id FROM categories WHERE nom = 'Fabrication')),
  ('Boulanger',   (SELECT id FROM categories WHERE nom = 'Alimentation')),
  ('Charcutier',  (SELECT id FROM categories WHERE nom = 'Alimentation'));

-- Artisans
INSERT INTO artisans (nom, description, email, telephone, adresse, ville, codePostal, image, artisanDuMois, specialiteId) VALUES
  (
    'Maçonnerie Dupont',
    'Construction et rénovation de bâtiments en pierre et béton.',
    'contact@maconnerie-dupont.fr', '0470000001', '12 rue des Tilleuls', 'Clermont-Ferrand', '63000',
    '/images/specialites/macon.svg', 1,
    (SELECT id FROM specialites WHERE nom = 'Maçon')
  ),
  (
    'Électricité Bernard',
    'Installations électriques pour particuliers et professionnels.',
    'contact@electricite-bernard.fr', '0470000002', '5 avenue de la République', 'Lyon', '69000',
    '/images/specialites/electricien.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Électricien')
  ),
  (
    'Plomberie Moreau',
    'Dépannage et installation sanitaire.',
    'contact@plomberie-moreau.fr', '0470000003', '8 rue Victor Hugo', 'Grenoble', '38000',
    '/images/specialites/plombier.svg', 1,
    (SELECT id FROM specialites WHERE nom = 'Plombier')
  ),
  (
    'Salon Coiff Création',
    'Coiffure homme, femme et enfant.',
    'contact@coiff-creation.fr', '0470000004', '3 place Bellecour', 'Lyon', '69002',
    '/images/specialites/coiffeur.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Coiffeur')
  ),
  (
    'Fleurs des Monts',
    'Compositions florales et fleurs de saison.',
    'contact@fleurs-des-monts.fr', '0470000005', '20 rue de la Paix', 'Annecy', '74000',
    '/images/specialites/fleuriste.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Fleuriste')
  ),
  (
    'Atelier Bois & Sens',
    'Fabrication de meubles sur mesure en bois massif.',
    'contact@atelier-bois-sens.fr', '0470000006', '1 chemin des Artisans', 'Valence', '26000',
    '/images/specialites/ebeniste.svg', 1,
    (SELECT id FROM specialites WHERE nom = 'Ébéniste')
  ),
  (
    'Bijouterie Lacroix',
    'Création et réparation de bijoux.',
    'contact@bijouterie-lacroix.fr', '0470000007', '15 rue du Commerce', 'Saint-Étienne', '42000',
    '/images/specialites/bijoutier.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Bijoutier')
  ),
  (
    'Boulangerie du Centre',
    'Pain et viennoiseries artisanales, fabrication maison chaque jour.',
    'contact@boulangerie-du-centre.fr', '0470000008', '2 place du Marché', 'Chambéry', '73000',
    '/images/specialites/boulanger.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Boulanger')
  ),
  (
    'Charcuterie des Alpes',
    'Charcuterie traditionnelle et produits locaux.',
    'contact@charcuterie-des-alpes.fr', '0470000009', '7 rue des Bouchers', 'Annonay', '07100',
    '/images/specialites/charcutier.svg', 0,
    (SELECT id FROM specialites WHERE nom = 'Charcutier')
  );

COMMIT;

-- Le compte administrateur n'est pas créé ici : son mot de passe ne doit pas
-- figurer dans le dépôt. Il est créé à partir des variables ADMIN_EMAIL et
-- ADMIN_PASSWORD du fichier .env avec : cd server && npm run create-admin
