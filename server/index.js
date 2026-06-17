require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');
const artisanRoutes = require('./routes/artisanRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Trouve ton artisan opérationnelle' });
});

app.use('/api/artisans', artisanRoutes);
app.use('/api/categories', categorieRoutes);

app.use(notFound);
app.use(errorHandler);

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
