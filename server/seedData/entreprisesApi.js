const API_BASE = 'https://recherche-entreprises.api.gouv.fr/search';
const REGION_AUVERGNE_RHONE_ALPES = '84';

// Code NAF/APE représentatif de chaque spécialité, utilisé pour interroger
// l'API publique "Recherche d'entreprises" (data.gouv.fr).
const NAF_PAR_SPECIALITE = {
  Maçon: '43.99C',
  Électricien: '43.21A',
  Plombier: '43.22A',
  Coiffeur: '96.02A',
  Fleuriste: '47.76Z',
  Ébéniste: '31.09B',
  Bijoutier: '32.12Z',
  Boulanger: '10.71C',
  Charcutier: '47.22Z',
};

const MOTS_CLES_IMAGE = {
  Maçon: 'masonry,construction',
  Électricien: 'electricity,wiring',
  Plombier: 'pipe,plumbing',
  Coiffeur: 'scissors,hair',
  Fleuriste: 'florist,flowers',
  Ébéniste: 'wood,workshop',
  Bijoutier: 'jeweler,jewelry',
  Boulanger: 'bakery,bread',
  Charcutier: 'butcher,charcuterie',
};

const slugify = (texte) =>
  texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const versCasseTitre = (texte) =>
  texte
    .toLowerCase()
    .replace(/(^|[\s'-])(\p{L})/gu, (_, sep, lettre) => `${sep}${lettre.toUpperCase()}`);

async function fetchEntreprisesPourSpecialite(nomSpecialite, limite) {
  const codeNaf = NAF_PAR_SPECIALITE[nomSpecialite];
  if (!codeNaf) return [];

  // On demande quelques résultats de plus que nécessaire car certains seront
  // écartés par le filtre sur l'état administratif du siège.
  const perPage = limite + 5;
  const url = `${API_BASE}?activite_principale=${encodeURIComponent(codeNaf)}&region=${REGION_AUVERGNE_RHONE_ALPES}&etat_administratif=A&est_entrepreneur_individuel=true&per_page=${perPage}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Réponse API ${response.status} pour ${nomSpecialite}`);
  }
  const data = await response.json();

  return (data.results || [])
    .filter(
      (entreprise) =>
        entreprise.siege?.adresse &&
        entreprise.siege?.etat_administratif === 'A' &&
        entreprise.siege?.region === REGION_AUVERGNE_RHONE_ALPES &&
        entreprise.siege?.statut_diffusion_etablissement === 'O'
    )
    .slice(0, limite)
    .map((entreprise) => {
      const { siege } = entreprise;
      const nomBrut = entreprise.nom_complet || entreprise.nom_raison_sociale || siege.siret;
      const nom = versCasseTitre(nomBrut);
      const slug = slugify(nomBrut);

      return {
        nom,
        description: `${nomSpecialite} basé(e) à ${versCasseTitre(siege.libelle_commune)}.`,
        // example.com est réservé par l'IANA (RFC 2606) : ces artisans étant
        // importés depuis un annuaire public, on garantit qu'aucun email réel
        // ne peut être atteint, même en production.
        email: `contact+${slug}@example.com`,
        telephone: '0470000000',
        adresse: versCasseTitre(`${siege.numero_voie || ''} ${siege.libelle_voie || ''}`.trim() || siege.adresse),
        ville: versCasseTitre(siege.libelle_commune),
        codePostal: siege.code_postal,
        image: `https://loremflickr.com/600/400/${MOTS_CLES_IMAGE[nomSpecialite]}?lock=${siege.siret}`,
        artisanDuMois: false,
      };
    });
}

module.exports = { fetchEntreprisesPourSpecialite, NAF_PAR_SPECIALITE };
