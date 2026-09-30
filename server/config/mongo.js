const mongoose = require('mongoose');

const connectMongo = () => {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI manquante : les messages de contact ne pourront pas être enregistrés');
    return Promise.resolve();
  }

  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch((err) => console.error('Erreur MongoDB :', err.message));
};

module.exports = { mongoose, connectMongo };
