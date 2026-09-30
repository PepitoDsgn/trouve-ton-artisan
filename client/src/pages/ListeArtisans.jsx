import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArtisanCard from '../components/ArtisanCard';
import useArtisans from '../hooks/useArtisans';
import useCategories from '../hooks/useCategories';
import { getTitreListe } from '../utils/titreListe';

function ListeArtisans() {
  const [searchParams] = useSearchParams();
  const categorieId = searchParams.get('categorie');
  const recherche = searchParams.get('recherche');

  const { artisans, loading } = useArtisans({ categorie: categorieId, recherche });
  const categories = useCategories();

  const categorie = categories.find((element) => element.id === Number(categorieId));
  const titre = getTitreListe({ categorieId, categorie, recherche });

  return (
    <div className="container py-5">
      <Helmet>
        <title>{titre} – Trouve ton artisan !</title>
        <meta
          name="description"
          content={`${titre} en Auvergne-Rhône-Alpes : parcourez les artisans, filtrez par catégorie et contactez celui qu'il vous faut.`}
        />
      </Helmet>
      <h1 className="section-title mb-5">{titre}</h1>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : artisans.length === 0 ? (
        <p className="text-center text-muted">Aucun artisan trouvé.</p>
      ) : (
        <>
          {/* Desktop (≥992px) : grille 4 colonnes */}
          <div className="d-none d-lg-block">
            <div className="row g-4">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="col-lg-3">
                  <ArtisanCard artisan={artisan} />
                </div>
              ))}
            </div>
          </div>

          {/* Tablette (768-991px) : grille 2 colonnes */}
          <div className="d-none d-md-block d-lg-none">
            <div className="row g-4">
              {artisans.map((artisan) => (
                <div key={artisan.id} className="col-6">
                  <ArtisanCard artisan={artisan} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile (<768px) : scroll horizontal natif */}
          <div className="d-md-none artisans-carousel" aria-label="Liste des artisans">
            {artisans.map((artisan) => (
              <ArtisanCard key={artisan.id} artisan={artisan} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListeArtisans;
