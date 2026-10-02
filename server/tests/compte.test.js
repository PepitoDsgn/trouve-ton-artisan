const { test, before, after, mock } = require('node:test');
const assert = require('node:assert/strict');
const transporter = require('../config/mailer');
const { app, request, MOT_DE_PASSE, initialiserBase, fermerConnexions, creerMembre, creerAdmin } = require('./helpers');
const { Utilisateur, Favori } = require('../models');
const Message = require('../models/mongo/message');

mock.method(transporter, 'sendMail', async () => ({}));

let membre;
let artisans;

before(async () => {
  ({ artisans } = await initialiserBase());
  membre = await creerMembre('rgpd@exemple.fr');
  await membre.put(`/api/favoris/${artisans[0].id}`);
  await membre.post(`/api/artisans/${artisans[0].id}/contact`).send({ nom: 'RGPD', email: 'rgpd@exemple.fr', message: 'Bonjour' });
});
after(fermerConnexions);

test('export : fichier JSON avec le compte, les favoris et les messages', async () => {
  const res = await membre.get('/api/auth/moi/donnees');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-disposition'], /mes-donnees-trouve-ton-artisan\.json/);
  assert.equal(res.body.compte.email, 'rgpd@exemple.fr');
  assert.equal(res.body.favoris.length, 1);
  assert.equal(res.body.messagesEnvoyes.length, 1);
  assert.ok(!JSON.stringify(res.body).includes('motDePasse'));
});

test('suppression : mot de passe obligatoire et vérifié', async () => {
  assert.equal((await membre.delete('/api/auth/moi').send({})).status, 400);
  assert.equal((await membre.delete('/api/auth/moi').send({ motDePasse: 'mauvais12' })).status, 401);
});

test('le compte administrateur ne peut pas être supprimé depuis le site', async () => {
  const admin = await creerAdmin();
  assert.equal((await admin.delete('/api/auth/moi').send({ motDePasse: MOT_DE_PASSE })).status, 403);
});

test('suppression : compte, favoris et messages effacés, session fermée', async () => {
  const utilisateur = await Utilisateur.findOne({ where: { email: 'rgpd@exemple.fr' } });

  assert.equal((await membre.delete('/api/auth/moi').send({ motDePasse: MOT_DE_PASSE })).status, 204);

  assert.equal(await Utilisateur.findByPk(utilisateur.id), null);
  assert.equal(await Favori.count({ where: { utilisateurId: utilisateur.id } }), 0);
  assert.equal(await Message.countDocuments({ utilisateurId: utilisateur.id }), 0);
  assert.equal((await membre.get('/api/auth/moi')).status, 401);
  const reconnexion = await request(app).post('/api/auth/connexion').send({ email: 'rgpd@exemple.fr', motDePasse: MOT_DE_PASSE });
  assert.equal(reconnexion.status, 401);
});
