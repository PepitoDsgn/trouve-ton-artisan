# Trouve ton artisan !

Plateforme web régionale permettant aux particuliers de la région Auvergne-Rhône-Alpes de trouver des artisans locaux.

## Stack technique

- **Frontend** : React + Bootstrap + Sass
- **Backend** : Node.js + Express + Sequelize
- **Base de données** : MySQL / MariaDB

## Structure du projet

```
trouve-ton-artisan/
├── client/          # Application React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── styles/
│       └── assets/
└── server/          # API Express
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    └── middlewares/
```

## Installation

```bash
# Backend
cd server
npm install
cp .env.example .env
npm run dev

# Frontend
cd client
npm install
npm start
```
