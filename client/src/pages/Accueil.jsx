import { Helmet } from 'react-helmet-async';
import ArtisanCard from '../components/ArtisanCard';
import useArtisansDuMois from '../hooks/useArtisansDuMois';

const etapes = [
  { num: 1, texte: "Choisir une Catégorie d'Artisan dans le menu" },
  { num: 2, texte: 'Choisir un Artisan' },
  { num: 3, texte: 'Le contacter via le formulaire' },
  { num: 4, texte: 'Une réponse sera apportée sous 48h' },
];

function Accueil() {
  const artisansDuMois = useArtisansDuMois();

  return (
    <>
      <Helmet>
        <title>Trouve ton artisan ! – Auvergne-Rhône-Alpes</title>
        <meta
          name="description"
          content="Trouvez facilement un artisan près de chez vous en Auvergne-Rhône-Alpes : bâtiment, services, fabrication, alimentation. Contactez-le en quelques clics."
        />
      </Helmet>
      <div className="container py-5">
        <section aria-labelledby="comment-trouver">
          <h1 id="comment-trouver" className="section-title mb-5">
            Comment trouver mon Artisan ?
          </h1>

          {/* Desktop / tablette : grands chiffres */}
          <div className="d-none d-sm-block mb-5">
            <div className="row text-center">
              {etapes.map((etape) => (
                <div key={etape.num} className="col-6 col-md-3">
                  <div className="how-to-number">{etape.num}</div>
                  <p className="mt-2" style={{ fontSize: '0.9rem' }}>{etape.texte}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile : liste dans une card */}
          <div className="d-sm-none mb-5">
            <div
              className="p-4 rounded-4"
              style={{ background: '#f1f8fc', fontSize: '0.95rem' }}
            >
              {etapes.map((etape) => (
                <p key={etape.num} className={etape.num < 4 ? 'mb-4' : 'mb-0'}>
                  <strong style={{ color: '#0074c7' }}>{etape.num}.</strong>{' '}
                  {etape.texte}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="artisans-du-mois">
          <h2 id="artisans-du-mois" className="section-title mb-4">
            Les Artisans du mois
          </h2>

          {/* Desktop (≥992px) : grille 3 colonnes */}
          <div className="d-none d-lg-block">
            <div className="row g-4 justify-content-center">
              {artisansDuMois.map((artisan) => (
                <div key={artisan.id} className="col-lg-4">
                  <ArtisanCard artisan={artisan} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile + tablette (<992px) : scroll horizontal natif */}
          <div className="d-lg-none artisans-carousel" aria-label="Artisans du mois">
            {artisansDuMois.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Accueil;
