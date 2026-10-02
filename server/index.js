require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const { connectMongo } = require('./config/mongo');

const PORT = process.env.PORT || 5000;

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  sequelize
    .authenticate()
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch((err) => console.error('Erreur DB :', err.message));
  connectMongo();
});
