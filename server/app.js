const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const { mongoose } = require('./config/mongo');
const authRoutes = require('./routes/authRoutes');
const artisanRoutes = require('./routes/artisanRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const favoriRoutes = require('./routes/favoriRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

// Application Express sans démarrage du serveur : importée par index.js
// et par les tests (Supertest).
const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'API Trouve ton artisan opérationnelle' });
});

app.use('/api/auth', authRoutes);
app.use('/api/artisans', artisanRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/favoris', favoriRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', async (_req, res) => {
  try {
    await sequelize.authenticate();
    const mongo = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.json({ status: 'ok', db: 'connected', mongo });
  } catch (err) {
    res.status(503).json({ status: 'error', db: err.message });
  }
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
