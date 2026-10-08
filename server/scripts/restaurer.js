require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { binaire, optionsMysql, executer } = require('./outilsBdd');

// Restaure une sauvegarde : npm run restauration -- <dossier> --confirmer
// Les données actuelles sont REMPLACÉES, d'où la confirmation obligatoire.
const restaurer = async (nomDossier) => {
  const dossier = path.resolve(__dirname, '..', 'backups', nomDossier);
  const fichierSql = path.join(dossier, 'mariadb.sql');
  const dossierMongo = path.join(dossier, 'mongodb');
  if (!fs.existsSync(fichierSql) || !fs.existsSync(dossierMongo)) {
    throw new Error(`sauvegarde incomplète ou introuvable : backups/${nomDossier}`);
  }

  const { args, env } = optionsMysql();
  executer(binaire('mysql'), [...args, '--default-character-set=utf8mb4'], {
    env,
    input: fs.readFileSync(fichierSql),
  });

  // La base MongoDB est vidée avant la restauration : mongorestore ignore les
  // collections vides de la sauvegarde, que --drop ne viderait donc pas
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  executer('mongorestore', ['--uri', process.env.MONGODB_URI, '--quiet', dossierMongo]);

  console.log(`Sauvegarde backups/${nomDossier} restaurée`);
};

const [nomDossier] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!nomDossier || !process.argv.includes('--confirmer')) {
  const disponibles = fs.existsSync(path.join(__dirname, '..', 'backups'))
    ? fs.readdirSync(path.join(__dirname, '..', 'backups')).sort().reverse()
    : [];
  console.log('Usage : npm run restauration -- <dossier> --confirmer');
  console.log('Attention : les données actuelles seront remplacées.');
  console.log(`Sauvegardes disponibles : ${disponibles.join(', ') || 'aucune'}`);
  process.exit(1);
}

restaurer(nomDossier).catch((error) => {
  console.error('Échec de la restauration :', error.message);
  process.exit(1);
});
