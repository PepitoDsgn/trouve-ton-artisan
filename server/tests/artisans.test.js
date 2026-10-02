const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app, request, initialiserBase, fermerConnexions, creerMembre } = require('./helpers');

let membre;
let donnees;

before(async () => {
  donnees = await initialiserBase();
  membre = await creerMembre();
});
after(fermerConnexions);

const noms = (res) => res.body.map((artisan) => artisan.nom);

describe('Accès réservé aux membres', () => {
  for (const url of ['/api/artisans', '/api/artisans/du-mois', '/api/artisans/1']) {
    test(`${url} sans session → 401`, async () => {
      assert.equal((await request(app).get(url)).status, 401);
    });
  }

  test('les catégories restent publiques (menu)', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 200);
    assert.deepEqual(noms(res), ['Alimentation', 'Bâtiment']);
  });
});

describe('Liste et fiche', () => {
  test('liste triée par nom', async () => {
    const res = await membre.get('/api/artisans');
    assert.equal(res.status, 200);
    assert.deepEqual(noms(res), ['Bâti Martin', 'Boulangerie Durand', 'Maçonnerie Dupont']);
  });

  test('filtre par catégorie', async () => {
    const res = await membre.get('/api/artisans').query({ categorie: donnees.categories.alimentation.id });
    assert.deepEqual(noms(res), ['Boulangerie Durand']);
  });

  test('recherche par nom', async () => {
    const res = await membre.get('/api/artisans').query({ recherche: 'dupont' });
    assert.deepEqual(noms(res), ['Maçonnerie Dupont']);
  });

  test('artisans du mois', async () => {
    assert.deepEqual(noms(await membre.get('/api/artisans/du-mois')), ['Maçonnerie Dupont']);
  });

  test('fiche avec spécialité et catégorie', async () => {
    const res = await membre.get(`/api/artisans/${donnees.artisans[0].id}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.Specialite.nom, 'Maçon');
    assert.equal(res.body.Specialite.Categorie.nom, 'Bâtiment');
  });

  test('artisan inexistant → 404', async () => {
    assert.equal((await membre.get('/api/artisans/99999')).status, 404);
  });

  test("l'email des artisans n'est jamais envoyé aux membres", async () => {
    const reponses = await Promise.all([
      membre.get('/api/artisans'),
      membre.get('/api/artisans/du-mois'),
      membre.get(`/api/artisans/${donnees.artisans[0].id}`),
    ]);
    for (const res of reponses) {
      assert.ok(!JSON.stringify(res.body).includes('@example.com'));
    }
  });
});
