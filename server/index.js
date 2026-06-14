require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const artisanRoutes = require('./routes/artisanRoutes');
const categorieRoutes = require('./routes/categorieRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Trouve ton artisan opérationnelle' });
});

app.use('/api/artisans', artisanRoutes);
app.use('/api/categories', categorieRoutes);

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connexion à la base de données réussie');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Impossible de se connecter à la base de données :', error);
  });
