const path = require('path');
const { spawnSync } = require('child_process');

// Dossier des binaires mysql / mysqldump (ex. /Applications/XAMPP/bin) ;
// vide = ceux du PATH
const binaire = (nom) => (process.env.MYSQL_BIN_DIR ? path.join(process.env.MYSQL_BIN_DIR, nom) : nom);

// Le mot de passe passe par MYSQL_PWD et non par la ligne de commande :
// il n'apparaît pas dans la liste des processus.
const optionsMysql = () => ({
  args: [
    '-h', process.env.DB_HOST || '127.0.0.1',
    '-P', process.env.DB_PORT || '3306',
    '-u', process.env.DB_ADMIN_USER || process.env.DB_USER,
  ],
  env: { ...process.env, MYSQL_PWD: process.env.DB_ADMIN_PASSWORD ?? process.env.DB_PASSWORD ?? '' },
});

// Lance une commande ; arrête le script avec son message d'erreur si elle échoue
const executer = (commande, args, options = {}) => {
  const resultat = spawnSync(commande, args, { encoding: 'utf8', ...options });
  if (resultat.error) throw new Error(`${commande} introuvable (${resultat.error.code}) : vérifiez MYSQL_BIN_DIR`);
  if (resultat.status !== 0) throw new Error(`${commande} a échoué : ${resultat.stderr.trim()}`);
  return resultat;
};

module.exports = { binaire, optionsMysql, executer };
