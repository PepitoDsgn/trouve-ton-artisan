const { test, before, after, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const transporter = require('../config/mailer');
const { app, request, initialiserBase, fermerConnexions, creerMembre } = require('./helpers');
const Message = require('../models/mongo/message');

// Aucun email réel pendant les tests : l'envoi SMTP est simulé
const envoiMail = mock.method(transporter, 'sendMail', async () => ({}));

let membre;
let artisans;

before(async () => {
  ({ artisans } = await initialiserBase());
  membre = await creerMembre();
});
after(fermerConnexions);
beforeEach(() => envoiMail.mock.resetCalls());

const message = { nom: 'Client Test', email: 'client@exemple.fr', objet: 'Devis', message: 'Bonjour' };

test('sans session → 401', async () => {
  assert.equal((await request(app).post(`/api/artisans/${artisans[0].id}/contact`).send(message)).status, 401);
});

test('champs obligatoires validés (400), aucun email envoyé', async () => {
  assert.equal((await membre.post(`/api/artisans/${artisans[0].id}/contact`).send({})).status, 400);
  assert.equal(envoiMail.mock.callCount(), 0);
});

test('message trop long : 400 avec un message explicite (écart corrigé du jeu d’essai)', async () => {
  const res = await membre.post(`/api/artisans/${artisans[0].id}/contact`).send({ ...message, message: 'a'.repeat(2001) });
  assert.equal(res.status, 400);
  assert.equal(res.body.message, 'Le message ne doit pas dépasser 2000 caractères');
});

test('artisan inexistant → 404', async () => {
  assert.equal((await membre.post('/api/artisans/99999/contact').send(message)).status, 404);
});

test("enregistre le message dans MongoDB et l'envoie à l'artisan", async () => {
  assert.equal((await membre.post(`/api/artisans/${artisans[0].id}/contact`).send(message)).status, 200);

  const enBase = await Message.findOne({ nom: 'Client Test' }).lean();
  assert.deepEqual(enBase.artisan, { id: artisans[0].id, nom: 'Maçonnerie Dupont' });
  assert.equal(enBase.objet, 'Devis');
  assert.equal(enBase.lu, false);

  assert.equal(envoiMail.mock.callCount(), 1);
  const [mail] = envoiMail.mock.calls[0].arguments;
  assert.equal(mail.to, 'dupont@example.com');
  assert.equal(mail.replyTo, 'client@exemple.fr');
  assert.equal(mail.subject, 'Devis');
});

test("l'objet est facultatif", async () => {
  const { objet, ...sansObjet } = message;
  assert.equal((await membre.post(`/api/artisans/${artisans[0].id}/contact`).send(sansObjet)).status, 200);
});

test('index TTL : les messages expirent après 365 jours', async () => {
  const index = (await Message.collection.indexes()).find((element) => element.expireAfterSeconds !== undefined);
  assert.deepEqual(index.key, { createdAt: 1 });
  assert.equal(index.expireAfterSeconds, 365 * 24 * 60 * 60);
});
