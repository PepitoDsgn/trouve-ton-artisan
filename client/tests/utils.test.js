import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContactForm } from '../src/utils/contactValidation.js';
import { validateConnexion, validateInscription } from '../src/utils/authValidation.js';
import { validateArtisan, versDonnees, versFormulaire, formulaireArtisanVide } from '../src/utils/artisanValidation.js';
import { getTitreListe } from '../src/utils/titreListe.js';
import { slugify, imageSpecialite } from '../src/utils/slugify.js';
import { destinationApresConnexion } from '../src/utils/redirection.js';

describe('validateContactForm', () => {
  const valide = { nom: 'Marie', email: 'marie@exemple.fr', objet: '', message: 'Bonjour' };

  test('formulaire valide (objet facultatif) → null', () => {
    assert.equal(validateContactForm(valide), null);
  });
  test('nom, email ou message vide (espaces compris) → validation', () => {
    assert.equal(validateContactForm({ ...valide, nom: '   ' }), 'validation');
    assert.equal(validateContactForm({ ...valide, email: '' }), 'validation');
    assert.equal(validateContactForm({ ...valide, message: '' }), 'validation');
  });
  test('email mal formé → emailInvalid', () => {
    for (const email of ['marie', 'marie@exemple', 'marie @exemple.fr', '@exemple.fr']) {
      assert.equal(validateContactForm({ ...valide, email }), 'emailInvalid', email);
    }
  });
});

describe('validateConnexion', () => {
  test('champs vides → message', () => {
    assert.match(validateConnexion({ email: '', motDePasse: '' }), /email et votre mot de passe/);
  });
  test('email invalide → message', () => {
    assert.match(validateConnexion({ email: 'marie', motDePasse: 'x' }), /pas valide/);
  });
  test('saisie correcte → null (la vérification du mot de passe reste côté serveur)', () => {
    assert.equal(validateConnexion({ email: ' marie@exemple.fr ', motDePasse: 'x' }), null);
  });
});

describe('validateInscription (mêmes règles que l’API)', () => {
  const valide = { email: 'marie@exemple.fr', motDePasse: 'motdepasse1', confirmation: 'motdepasse1' };
  const cas = [
    ['valide', valide, null],
    ['champ vide', { ...valide, confirmation: '' }, /tous les champs/],
    ['moins de 8 caractères', { ...valide, motDePasse: 'abc12', confirmation: 'abc12' }, /8 caractères/],
    ['sans chiffre', { ...valide, motDePasse: 'motdepasse', confirmation: 'motdepasse' }, /lettre et un chiffre/],
    ['sans lettre', { ...valide, motDePasse: '12345678', confirmation: '12345678' }, /lettre et un chiffre/],
    ['confirmation différente', { ...valide, confirmation: 'motdepasse2' }, /ne correspondent pas/],
  ];
  for (const [nom, form, attendu] of cas) {
    test(nom, () => {
      const resultat = validateInscription(form);
      if (attendu === null) assert.equal(resultat, null);
      else assert.match(resultat, attendu);
    });
  }
});

describe('validateArtisan', () => {
  const valide = { ...formulaireArtisanVide, nom: 'Atelier', specialiteId: '3', email: 'a@example.com', ville: 'Lyon' };

  test('champs obligatoires seuls → null', () => {
    assert.equal(validateArtisan(valide), null);
  });
  test('champs obligatoires manquants', () => {
    assert.match(validateArtisan({ ...valide, nom: '' }), /nom/);
    assert.match(validateArtisan({ ...valide, specialiteId: '' }), /spécialité/);
    assert.match(validateArtisan({ ...valide, ville: ' ' }), /ville/);
  });
  test('formats facultatifs contrôlés s’ils sont remplis', () => {
    assert.match(validateArtisan({ ...valide, telephone: '123' }), /10 chiffres/);
    assert.match(validateArtisan({ ...valide, codePostal: '6900' }), /5 chiffres/);
    assert.equal(validateArtisan({ ...valide, telephone: '0470000000', codePostal: '69001' }), null);
  });
  test('image : https ou /images/ uniquement (pas de javascript:)', () => {
    assert.match(validateArtisan({ ...valide, image: 'javascript:alert(1)' }), /URL https/);
    assert.match(validateArtisan({ ...valide, image: 'http://site.fr/a.png' }), /URL https/);
    assert.equal(validateArtisan({ ...valide, image: '/images/specialites/macon.svg' }), null);
  });
});

describe('conversions formulaire artisan', () => {
  test('versFormulaire : les null de l’API deviennent des chaînes vides', () => {
    const form = versFormulaire({ nom: 'Atelier', telephone: null, specialiteId: 3, artisanDuMois: true, id: 9 });
    assert.equal(form.telephone, '');
    assert.equal(form.artisanDuMois, true);
    assert.ok(!('id' in form), 'seuls les champs du formulaire sont repris');
  });
  test('versDonnees : textes nettoyés, spécialité numérique', () => {
    const donnees = versDonnees({ ...formulaireArtisanVide, nom: '  Atelier  ', specialiteId: '3' });
    assert.equal(donnees.nom, 'Atelier');
    assert.equal(donnees.specialiteId, 3);
  });
});

describe('getTitreListe', () => {
  test('catégorie connue → titre dédié', () => {
    assert.equal(getTitreListe({ categorieId: '1', categorie: { nom: 'Bâtiment' } }), 'Les Artisans du Bâtiment');
  });
  test('catégorie sans titre dédié → titre générique', () => {
    assert.equal(getTitreListe({ categorieId: '9', categorie: { nom: 'Textile' } }), 'Les Artisans – Textile');
  });
  test('catégorie pas encore chargée → titre neutre, pas celui de la recherche', () => {
    assert.equal(getTitreListe({ categorieId: '1', categorie: undefined, recherche: 'pain' }), 'Nos Artisans');
  });
  test('recherche seule, ou rien', () => {
    assert.equal(getTitreListe({ recherche: 'pain' }), 'Résultats pour "pain"');
    assert.equal(getTitreListe({}), 'Nos Artisans');
  });
});

describe('slugify / imageSpecialite', () => {
  test('accents, espaces et majuscules', () => {
    assert.equal(slugify('Électricien'), 'electricien');
    assert.equal(slugify('Ébéniste'), 'ebeniste');
    assert.equal(slugify('  Maçon du Rhône '), 'macon-du-rhone');
  });
  test('chemin de l’illustration', () => {
    assert.equal(imageSpecialite('Maçon'), '/images/specialites/macon.svg');
  });
});

describe('destinationApresConnexion', () => {
  test('retour à la page demandée avec ses paramètres', () => {
    const location = { state: { from: { pathname: '/artisans', search: '?categorie=1' } } };
    assert.equal(destinationApresConnexion(location), '/artisans?categorie=1');
  });
  test('sans page demandée → accueil', () => {
    assert.equal(destinationApresConnexion({ state: null }), '/');
  });
});
