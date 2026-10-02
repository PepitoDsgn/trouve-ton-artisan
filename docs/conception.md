# Conception – Trouve ton artisan !

Schémas de conception du projet, établis à partir du code. Les diagrammes sont écrits en Mermaid : GitHub les affiche directement, et ils peuvent être exportés en image depuis [mermaid.live](https://mermaid.live).

## 1. Acteurs et cas d'utilisation

| Acteur | Cas d'utilisation |
|---|---|
| **Visiteur** | Consulter l'accueil · Créer un compte · Se connecter · Lire les pages légales |
| **Membre** (hérite du visiteur) | Parcourir les artisans par catégorie · Rechercher un artisan par nom · Consulter une fiche · Contacter un artisan · Gérer ses favoris · Télécharger ses données · Supprimer son compte · Se déconnecter |
| **Administrateur** (hérite du membre) | Ajouter / modifier / supprimer un artisan · Désigner les artisans du mois (3 max.) · Consulter les messages · Marquer un message lu / non lu · Supprimer un message |

```mermaid
flowchart LR
  V["👤 Visiteur"]
  M["👤 Membre"]
  A["👤 Administrateur"]

  subgraph Site["Trouve ton artisan !"]
    UC1([Créer un compte])
    UC2([Se connecter])
    UC3([Parcourir / rechercher les artisans])
    UC4([Consulter une fiche artisan])
    UC5([Contacter un artisan])
    UC6([Gérer ses favoris])
    UC7([Télécharger ses données / supprimer son compte])
    UC8([Gérer les artisans])
    UC9([Choisir les artisans du mois])
    UC10([Consulter les messages])
  end

  V --- UC1
  V --- UC2
  M --- UC3
  M --- UC4
  M --- UC5
  M --- UC6
  M --- UC7
  A --- UC8
  A --- UC9
  A --- UC10
  M -. hérite de .-> V
  A -. hérite de .-> M
```

## 2. Architecture

```mermaid
flowchart LR
  subgraph Navigateur
    R["React (Vite)<br/>pages · hooks · contextes"]
  end

  subgraph API["API Node.js / Express"]
    direction TB
    RT["routes<br/>+ validation (express-validator)"]
    MW["middlewares<br/>requireAuth · requireAdmin · rate limit"]
    C["controllers<br/>(HTTP uniquement)"]
    S["services<br/>(logique métier)"]
    RT --> MW --> C --> S
  end

  SQL[("MariaDB<br/>Sequelize")]
  NOSQL[("MongoDB<br/>Mongoose")]
  SMTP["Serveur SMTP<br/>(Nodemailer)"]

  R -- "HTTP JSON<br/>cookie de session httpOnly" --> RT
  S --> SQL
  S --> NOSQL
  S --> SMTP
```

## 3. Base relationnelle (MariaDB)

### MCD (Merise)

| Association | Entités | Cardinalités |
|---|---|---|
| **APPARTENIR** | SPÉCIALITÉ – CATÉGORIE | une spécialité appartient à **1,1** catégorie ; une catégorie regroupe **0,n** spécialités |
| **EXERCER** | ARTISAN – SPÉCIALITÉ | un artisan exerce **1,1** spécialité ; une spécialité est exercée par **0,n** artisans |
| **FAVORISER** | UTILISATEUR – ARTISAN | un utilisateur a **0,n** artisans favoris ; un artisan est favori de **0,n** utilisateurs (porte la date d'ajout) |

### MLD / MPD

`favoris` est la table issue de l'association **FAVORISER** (n,n) : sa clé primaire est composée des deux clés étrangères.

```mermaid
erDiagram
  categories ||--o{ specialites : "regroupe"
  specialites ||--o{ artisans : "est exercée par"
  utilisateurs ||--o{ favoris : "enregistre"
  artisans ||--o{ favoris : "est favori dans"

  categories {
    INT id PK
    VARCHAR nom UK
  }
  specialites {
    INT id PK
    VARCHAR nom UK
    INT categorieId FK
  }
  artisans {
    INT id PK
    VARCHAR nom
    TEXT description
    VARCHAR email "jamais envoyé aux membres"
    VARCHAR telephone
    VARCHAR adresse
    VARCHAR ville
    VARCHAR codePostal
    VARCHAR image
    TINYINT artisanDuMois "3 maximum"
    INT specialiteId FK
  }
  utilisateurs {
    INT id PK
    VARCHAR email UK
    VARCHAR motDePasse "hash bcrypt"
    ENUM role "user | admin"
    DATETIME createdAt
    DATETIME updatedAt
  }
  favoris {
    INT utilisateurId PK, FK
    INT artisanId PK, FK
    DATETIME createdAt
  }
```

Toutes les clés étrangères sont en `ON DELETE CASCADE` : supprimer un artisan ou un compte supprime les favoris correspondants.

## 4. Base NoSQL (MongoDB)

Collection `messages` : un document par message de contact.

```json
{
  "_id": "ObjectId",
  "artisan": { "id": 13, "nom": "Maçonnerie Dupont" },
  "utilisateurId": 2,
  "nom": "Jean Martin",
  "email": "jean.martin@exemple.fr",
  "objet": "Demande de devis",
  "message": "Bonjour, ...",
  "lu": false,
  "createdAt": "2026-10-02T09:15:00.000Z",
  "updatedAt": "2026-10-02T09:15:00.000Z"
}
```

| Index | Rôle |
|---|---|
| `artisan.id` | retrouver les messages d'un artisan |
| `createdAt` (TTL 365 jours) | suppression automatique après 12 mois (RGPD) |

**Pourquoi MongoDB pour les messages ?** Un message est un document autonome : écrit une fois, lu par l'administrateur, sans jointure. Le nom de l'artisan y est recopié (dénormalisation) pour que le message reste lisible même si l'artisan est supprimé de la base SQL. Les données reliées entre elles (catégories, spécialités, artisans, comptes, favoris) restent en relationnel, où les clés étrangères garantissent leur cohérence.

## 5. Séquence : connexion

```mermaid
sequenceDiagram
  actor U as Membre
  participant F as React
  participant A as API Express
  participant DB as MariaDB

  U->>F: saisit email + mot de passe
  F->>F: validation locale (champs, format email)
  F->>A: POST /api/auth/connexion
  A->>A: limite de débit (5 échecs / 15 min)
  A->>A: validation express-validator
  A->>DB: SELECT utilisateur par email
  DB-->>A: utilisateur + hash bcrypt
  A->>A: bcrypt.compare (hash factice si email inconnu)
  alt identifiants valides
    A->>A: signe un JWT { sub, role } valable 2 h
    A-->>F: 200 + Set-Cookie: token (httpOnly, SameSite=Lax)
    F->>F: AuthContext : utilisateur connecté
    F-->>U: redirection vers la page demandée
  else identifiants invalides
    A-->>F: 401 « Email ou mot de passe incorrect »
    F-->>U: message d'erreur
  end
```

## 6. Séquence : accès à une route protégée (admin)

```mermaid
sequenceDiagram
  participant F as React
  participant A as API Express
  participant DB as MariaDB

  F->>A: PUT /api/admin/artisans/13 (cookie envoyé automatiquement)
  A->>A: requireAuth : vérifie la signature et l'expiration du JWT
  A->>DB: l'utilisateur existe-t-il encore ?
  alt pas de cookie / token invalide / compte supprimé
    A-->>F: 401 → AuthContext déconnecte, redirection /connexion
  else rôle ≠ admin
    A-->>F: 403 « Accès réservé aux administrateurs »
  else admin
    A->>A: validation des champs, liste blanche des champs modifiables
    A->>DB: règle métier : 3 artisans du mois maximum
    A->>DB: UPDATE artisans
    A-->>F: 200 + artisan modifié
  end
```

## 7. Séquence : message de contact (SQL + NoSQL)

```mermaid
sequenceDiagram
  actor U as Membre
  participant A as API Express
  participant DB as MariaDB
  participant M as MongoDB
  participant S as SMTP

  U->>A: POST /api/artisans/13/contact
  A->>A: requireAuth · limite de débit · validation
  A->>DB: artisan 13 (avec son email, côté serveur uniquement)
  alt artisan inexistant
    A-->>U: 404
  else
    A->>M: insertOne(message)
    A-->>U: 200 « Votre message a bien été envoyé »
    A-)S: email à l'artisan (asynchrone, replyTo = membre)
  end
```
