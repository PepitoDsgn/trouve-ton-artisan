# Trouve ton artisan !

Plateforme web régionale permettant aux particuliers de la région Auvergne-Rhône-Alpes de trouver des artisans locaux.

## Fonctionnalités

- **Visiteur** : page d'accueil, création de compte, connexion, pages légales.
- **Membre connecté** : liste des artisans par catégorie, recherche par nom, fiche artisan, formulaire de contact, artisans favoris (page « Mes favoris »).
- **Administrateur** : ajout, modification et suppression des artisans, choix des artisans du mois (3 maximum), consultation des messages de contact (lu / non lu, suppression).

## Stack technique

- **Frontend** : React (Vite) + React Router + Bootstrap + Sass
- **Backend** : Node.js + Express
- **Base relationnelle** : MySQL / MariaDB via Sequelize (catégories, spécialités, artisans, utilisateurs, favoris)
- **Base NoSQL** : MongoDB via Mongoose (messages de contact)

## Structure du projet

```
trouve-ton-artisan/
├── client/                # Application React
│   ├── public/images/     # Illustrations des spécialités
│   └── src/
│       ├── components/    # Composants d'interface (Navbar, ArtisanCard, ProtectedRoute...)
│       ├── context/       # Session (AuthContext) et favoris (FavorisContext)
│       ├── hooks/         # Chargement des données et logique des formulaires
│       ├── pages/         # Pages, dont pages/admin
│       ├── services/      # Appels à l'API (axios)
│       ├── utils/         # Fonctions pures : validation, titres, slug
│       └── styles/
├── server/                # API Express
│   ├── config/            # Connexions MariaDB / MongoDB, mailer, options de session
│   ├── controllers/       # Requête / réponse HTTP uniquement
│   ├── services/          # Logique métier et accès aux données
│   ├── models/            # Modèles Sequelize (+ models/mongo pour Mongoose)
│   ├── routes/            # Routes et validation des entrées (express-validator)
│   ├── middlewares/       # Authentification, rôles, limitation de débit, erreurs
│   └── scripts/           # createAdmin.js
└── database/              # Scripts SQL de création et d'alimentation
```

## Installation en local

Prérequis : Node.js, MariaDB (ou MySQL) et MongoDB.

```bash
# 1. Base MariaDB (crée la base, les tables et les données de démo)
mysql -u root -p < database/create_database.sql
mysql -u root -p < database/seed_database.sql

# 2. MongoDB (macOS / Homebrew)
brew services start mongodb-community

# 3. Backend
cd server
npm install
cp .env.example .env      # puis remplir les variables
npm run create-admin      # crée le compte administrateur défini dans .env
npm run dev               # http://localhost:5000

# 4. Frontend
cd client
npm install
npm run dev               # http://localhost:5173
```

`npm run seed` (dans `server/`) recrée entièrement la base MariaDB : données de démo, artisans réels importés depuis l'API publique « Recherche d'entreprises », et compte administrateur.

## API

| Méthode | Route | Accès | Rôle |
|---|---|---|---|
| POST | `/api/auth/inscription` | public | Créer un compte membre |
| POST | `/api/auth/connexion` | public | Se connecter (5 échecs max / 15 min) |
| POST | `/api/auth/deconnexion` | public | Se déconnecter |
| GET | `/api/auth/moi` | membre | Utilisateur connecté |
| GET | `/api/categories` | public | Catégories (menu) |
| GET | `/api/artisans` | membre | Liste (`?categorie=`, `?recherche=`) |
| GET | `/api/artisans/du-mois` | membre | Artisans du mois |
| GET | `/api/artisans/:id` | membre | Fiche artisan |
| POST | `/api/artisans/:id/contact` | membre | Message de contact (MongoDB + email) |
| GET | `/api/favoris` | membre | Mes favoris |
| PUT / DELETE | `/api/favoris/:artisanId` | membre | Ajouter / retirer un favori |
| GET | `/api/admin/specialites` | admin | Spécialités (formulaire) |
| POST | `/api/admin/artisans` | admin | Créer un artisan |
| PUT / DELETE | `/api/admin/artisans/:id` | admin | Modifier / supprimer un artisan |
| GET | `/api/admin/messages` | admin | Messages (`?lu=false`) |
| PATCH / DELETE | `/api/admin/messages/:id` | admin | Marquer lu / supprimer |

## Sécurité

- Mots de passe hachés avec **bcrypt** (12 tours), jamais renvoyés par l'API.
- Session : **JWT** (2 h) dans un cookie `httpOnly`, `SameSite=Lax`, `Secure` en production : inaccessible au JavaScript de la page.
- Rôles vérifiés côté serveur (`requireAuth`, `requireAdmin`) ; le frontend ne fait que masquer les pages.
- Validation de toutes les entrées avec express-validator ; seuls les champs autorisés sont enregistrés.
- Limitation de débit sur la connexion, l'inscription et le formulaire de contact.
- En-têtes HTTP sécurisés avec helmet ; CORS limité à `CLIENT_URL`.

## Démo en local

Le projet est présenté en local, sans hébergement en ligne. Avant une démonstration :

1. Démarrer MariaDB (panneau XAMPP) et MongoDB (`brew services start mongodb-community`).
2. Lancer l'API (`cd server && npm run dev`) : le terminal doit afficher les connexions à MariaDB et à MongoDB.
3. Lancer le frontend (`cd client && npm run dev`) puis ouvrir http://localhost:5173.
4. Se connecter avec un compte membre et avec le compte administrateur (défini dans `server/.env`).
