const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app, request, initialiserBase, fermerConnexions, creerMembre, creerAdmin } = require('./helpers');

let membre;
let autreMembre;
let artisans;

before(async () => {
  ({ artisans } = await initialiserBase());
  membre = await creerMembre('membre@exemple.fr');
  autreMembre = await creerMembre('autre@exemple.fr');
});
after(fermerConnexions);

const idsFavoris = async (agent) => (await agent.get('/api/favoris')).body.map((artisan) => artisan.id);

test('sans session → 401', async () => {
  assert.equal((await request(app).get('/api/favoris')).status, 401);
});

test('ajout idempotent : ajouter deux fois ne crée pas de doublon', async () => {
  assert.equal((await membre.put(`/api/favoris/${artisans[0].id}`)).status, 204);
  assert.equal((await membre.put(`/api/favoris/${artisans[0].id}`)).status, 204);
  assert.deepEqual(await idsFavoris(membre), [artisans[0].id]);
});

test('les favoris sont propres à chaque membre', async () => {
  assert.deepEqual(await idsFavoris(autreMembre), []);
});

test('artisan inexistant → 404, identifiant invalide → 400', async () => {
  assert.equal((await membre.put('/api/favoris/99999')).status, 404);
  assert.equal((await membre.put('/api/favoris/abc')).status, 400);
});

test('retrait', async () => {
  await membre.put(`/api/favoris/${artisans[1].id}`);
  assert.equal((await membre.delete(`/api/favoris/${artisans[0].id}`)).status, 204);
  assert.deepEqual(await idsFavoris(membre), [artisans[1].id]);
});

test('supprimer un artisan supprime ses favoris (clé étrangère en cascade)', async () => {
  const admin = await creerAdmin();
  await admin.delete(`/api/admin/artisans/${artisans[1].id}`);
  assert.deepEqual(await idsFavoris(membre), []);
});
