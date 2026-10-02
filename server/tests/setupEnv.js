// Chargé avant chaque fichier de test : reprend la configuration locale (.env)
// mais bascule sur des bases dédiées, pour ne jamais toucher aux vraies données.
require('dotenv').config({ quiet: true });

process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'trouve_ton_artisan_test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/trouve_ton_artisan_test';
process.env.JWT_SECRET = 'secret-de-test-uniquement';
