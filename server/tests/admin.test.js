const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app, request, initialiserBase, fermerConnexions, creerMembre, creerAdmin } = require('./helpers');
const Message = require('../models/mongo/message');

let admin;
let membre;
let donnees;

before(async () => {
  donnees = await initialiserBase();
  admin = await creerAdmin();
  membre = await creerMembre();
});
after(fermerConnexions);

const nouvelArtisan = (champs = {}) => ({
  nom: 'Fromagerie Test',
  email: 'fromagerie@example.com',
  ville: 'Chambéry',
  specialiteId: donnees.specialites.boulanger.id,
  ...champs,
});

describe('Contrôle des rôles', () => {
  test('sans session → 401, membre → 403', async () => {
    assert.equal((await request(app).get('/api/admin/messages')).status, 401);
    assert.equal((await membre.get('/api/admin/messages')).status, 403);
    assert.equal((await membre.post('/api/admin/artisans').send(nouvelArtisan())).status, 403);
  });
});

describe('Gestion des artisans', () => {
  let creeId;

  test('création : champs obligatoires validés', async () => {
    assert.equal((await admin.post('/api/admin/artisans').send({ nom: 'Incomplet' })).status, 400);
  });

  test('création : spécialité inconnue → 400', async () => {
    const res = await admin.post('/api/admin/artisans').send(nouvelArtisan({ specialiteId: 99999 }));
    assert.equal(res.status, 400);
    assert.equal(res.body.message, 'Spécialité inconnue');
  });

  test('création : image javascript: refusée', async () => {
    const res = await admin.post('/api/admin/artisans').send(nouvelArtisan({ image: 'javascript:alert(1)' }));
    assert.equal(res.status, 400);
  });

  test('création réussie ; les champs non autorisés (id) sont ignorés', async () => {
    const res = await admin.post('/api/admin/artisans').send(nouvelArtisan({ id: 1, codePostal: '73000' }));
    assert.equal(res.status, 201);
    assert.notEqual(res.body.id, 1);
    assert.equal(res.body.Specialite.nom, 'Boulanger');
    creeId = res.body.id;
  });

  test("la fiche admin contient l'email", async () => {
    assert.equal((await admin.get(`/api/admin/artisans/${creeId}`)).body.email, 'fromagerie@example.com');
  });

  test('modification partielle', async () => {
    const res = await admin.put(`/api/admin/artisans/${creeId}`).send({ ville: 'Annecy' });
    assert.equal(res.status, 200);
    assert.equal(res.body.ville, 'Annecy');
    assert.equal(res.body.nom, 'Fromagerie Test');
  });

  test('modification : code postal invalide → 400, artisan inexistant → 404', async () => {
    assert.equal((await admin.put(`/api/admin/artisans/${creeId}`).send({ codePostal: '123' })).status, 400);
    assert.equal((await admin.put('/api/admin/artisans/99999').send({ ville: 'Lyon' })).status, 404);
  });

  test('suppression puis 404', async () => {
    assert.equal((await admin.delete(`/api/admin/artisans/${creeId}`)).status, 204);
    assert.equal((await admin.delete(`/api/admin/artisans/${creeId}`)).status, 404);
  });
});

describe('Règle métier : 3 artisans du mois maximum', () => {
  test('on peut monter à 3, le 4e est refusé (409)', async () => {
    const [, deuxieme, troisieme] = donnees.artisans;
    assert.equal((await admin.put(`/api/admin/artisans/${deuxieme.id}`).send({ artisanDuMois: true })).status, 200);
    assert.equal((await admin.put(`/api/admin/artisans/${troisieme.id}`).send({ artisanDuMois: true })).status, 200);

    const res = await admin.post('/api/admin/artisans').send(nouvelArtisan({ artisanDuMois: true }));
    assert.equal(res.status, 409);
    assert.equal(res.body.message, 'Il y a déjà 3 artisans du mois');
  });

  test("re-cocher un artisan déjà du mois n'est pas bloqué", async () => {
    const res = await admin.put(`/api/admin/artisans/${donnees.artisans[0].id}`).send({ artisanDuMois: true });
    assert.equal(res.status, 200);
  });
});

describe('Messages de contact (MongoDB)', () => {
  let messageId;

  before(async () => {
    const message = await Message.create({
      artisan: { id: donnees.artisans[0].id, nom: donnees.artisans[0].nom },
      utilisateurId: 1,
      nom: 'Client',
      email: 'client@exemple.fr',
      message: 'Bonjour',
    });
    messageId = message.id;
  });

  test('liste, puis filtre non lus', async () => {
    assert.equal((await admin.get('/api/admin/messages')).body.length, 1);
    assert.equal((await admin.get('/api/admin/messages').query({ lu: false })).body.length, 1);
  });

  test('marquer lu', async () => {
    const res = await admin.patch(`/api/admin/messages/${messageId}`).send({ lu: true });
    assert.equal(res.body.lu, true);
    assert.equal((await admin.get('/api/admin/messages').query({ lu: false })).body.length, 0);
  });

  test('identifiant invalide → 400, suppression puis 404', async () => {
    assert.equal((await admin.patch('/api/admin/messages/abc').send({ lu: true })).status, 400);
    assert.equal((await admin.delete(`/api/admin/messages/${messageId}`)).status, 204);
    assert.equal((await admin.delete(`/api/admin/messages/${messageId}`)).status, 404);
  });
});
