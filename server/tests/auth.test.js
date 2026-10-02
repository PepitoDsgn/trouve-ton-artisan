const { describe, test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { app, request, MOT_DE_PASSE, initialiserBase, fermerConnexions, creerMembre } = require('./helpers');
const { Utilisateur } = require('../models');

before(initialiserBase);
after(fermerConnexions);

describe('Inscription', () => {
  const casInvalides = [
    ['un email invalide', { email: 'pas-un-email', motDePasse: 'motdepasse1' }, 'Email invalide'],
    ['un mot de passe trop court', { email: 'a@exemple.fr', motDePasse: 'abc1' }, '8 caractères'],
    ['un mot de passe sans chiffre', { email: 'a@exemple.fr', motDePasse: 'motdepasse' }, 'un chiffre'],
    ['un mot de passe sans lettre', { email: 'a@exemple.fr', motDePasse: '12345678' }, 'une lettre'],
  ];
  for (const [cas, corps, message] of casInvalides) {
    test(`refuse ${cas} (400)`, async () => {
      const res = await request(app).post('/api/auth/inscription').send(corps);
      assert.equal(res.status, 400);
      assert.match(res.body.message, new RegExp(message));
    });
  }

  test('ne renvoie jamais la valeur saisie dans les erreurs de validation', async () => {
    const res = await request(app).post('/api/auth/inscription').send({ email: 'a@exemple.fr', motDePasse: 'secret1' });
    assert.ok(!JSON.stringify(res.body).includes('secret1'));
  });

  test('crée un compte membre, ouvre la session et hache le mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/inscription')
      .send({ email: 'Nouveau@Exemple.fr', motDePasse: MOT_DE_PASSE });

    assert.equal(res.status, 201);
    assert.deepEqual(Object.keys(res.body.utilisateur).sort(), ['email', 'id', 'role']);
    assert.equal(res.body.utilisateur.email, 'nouveau@exemple.fr');
    assert.equal(res.body.utilisateur.role, 'user');

    const cookie = res.headers['set-cookie'][0];
    assert.match(cookie, /^token=/);
    assert.match(cookie, /HttpOnly/);
    assert.match(cookie, /SameSite=Lax/);

    const enBase = await Utilisateur.scope('avecMotDePasse').findOne({ where: { email: 'nouveau@exemple.fr' } });
    assert.match(enBase.motDePasse, /^\$2[aby]\$12\$/);
  });

  test("ne permet pas de choisir son rôle à l'inscription", async () => {
    const res = await request(app)
      .post('/api/auth/inscription')
      .send({ email: 'pirate@exemple.fr', motDePasse: MOT_DE_PASSE, role: 'admin' });
    assert.equal(res.status, 201);
    assert.equal(res.body.utilisateur.role, 'user');
  });

  test('refuse un email déjà utilisé (409)', async () => {
    const res = await request(app)
      .post('/api/auth/inscription')
      .send({ email: 'nouveau@exemple.fr', motDePasse: MOT_DE_PASSE });
    assert.equal(res.status, 409);
  });
});

describe('Connexion / session', () => {
  test('connexion réussie puis /moi renvoie le membre', async () => {
    const agent = request.agent(app);
    const connexion = await agent.post('/api/auth/connexion').send({ email: 'nouveau@exemple.fr', motDePasse: MOT_DE_PASSE });
    assert.equal(connexion.status, 200);

    const moi = await agent.get('/api/auth/moi');
    assert.equal(moi.status, 200);
    assert.equal(moi.body.utilisateur.email, 'nouveau@exemple.fr');
  });

  test('même message pour un email inconnu et un mauvais mot de passe', async () => {
    const inconnu = await request(app).post('/api/auth/connexion').send({ email: 'inconnu@exemple.fr', motDePasse: MOT_DE_PASSE });
    const mauvais = await request(app).post('/api/auth/connexion').send({ email: 'nouveau@exemple.fr', motDePasse: 'mauvais12' });
    assert.equal(inconnu.status, 401);
    assert.equal(mauvais.status, 401);
    assert.equal(inconnu.body.message, mauvais.body.message);
  });

  test('refuse un token falsifié', async () => {
    const res = await request(app)
      .get('/api/auth/moi')
      .set('Cookie', 'token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjEsInJvbGUiOiJhZG1pbiJ9.faux');
    assert.equal(res.status, 401);
  });

  test('la déconnexion efface le cookie de session', async () => {
    const agent = await creerMembre('deconnexion@exemple.fr');
    assert.equal((await agent.post('/api/auth/deconnexion')).status, 204);
    assert.equal((await agent.get('/api/auth/moi')).status, 401);
  });

  test('bloque après 5 échecs de connexion (429), même avec le bon mot de passe', async () => {
    // 2 échecs déjà comptés dans le test « même message » ci-dessus
    for (let i = 0; i < 3; i += 1) {
      await request(app).post('/api/auth/connexion').send({ email: 'nouveau@exemple.fr', motDePasse: 'mauvais12' });
    }
    const res = await request(app).post('/api/auth/connexion').send({ email: 'nouveau@exemple.fr', motDePasse: MOT_DE_PASSE });
    assert.equal(res.status, 429);
  });
});
