require('dotenv').config({ quiet: true });
const fs = require('fs');
const path = require('path');
const { binaire, optionsMysql, executer } = require('./outilsBdd');

// Sauvegarde MariaDB (mysqldump) + MongoDB (mongodump) dans backups/<date>/
const sauvegarder = () => {
  // Heure locale, ex. 2026-10-08_15h44
  const maintenant = new Date();
  const deuxChiffres = (n) => String(n).padStart(2, '0');
  const horodatage = `${maintenant.getFullYear()}-${deuxChiffres(maintenant.getMonth() + 1)}-${deuxChiffres(maintenant.getDate())}`
    + `_${deuxChiffres(maintenant.getHours())}h${deuxChiffres(maintenant.getMinutes())}`;
  const dossier = path.join(__dirname, '..', 'backups', horodatage);
  fs.mkdirSync(dossier, { recursive: true });

  // --single-transaction : copie cohérente sans bloquer l'application (InnoDB)
  // --databases : le fichier recrée la base et s'y place (USE) à la restauration
  const { args, env } = optionsMysql();
  const dump = executer(binaire('mysqldump'), [
    ...args,
    '--single-transaction',
    '--default-character-set=utf8mb4',
    '--databases', process.env.DB_NAME,
  ], { env, maxBuffer: 512 * 1024 * 1024 });
  fs.writeFileSync(path.join(dossier, 'mariadb.sql'), dump.stdout);

  executer('mongodump', ['--uri', process.env.MONGODB_URI, '--out', path.join(dossier, 'mongodb'), '--quiet']);

  console.log(`Sauvegarde créée : backups/${horodatage}`);
};

try {
  sauvegarder();
} catch (error) {
  console.error('Échec de la sauvegarde :', error.message);
  process.exit(1);
}
