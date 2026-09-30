import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArtisanCard from '../components/ArtisanCard';
import { getArtisans, getCategories } from '../services/api';

const titresCategorie = {
  Bâtiment: 'Les Artisans du Bâtiment',
  Services: 'Les Artisans du Service',
  Fabrication: 'Les Artisans en Fabrication',
  Alimentation: "Les Artisans de l'Alimentaire",
};

function ListeArtisans() {
  const [searchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [titre, setTitre] = useState('Nos Artisans');
  const [loading, setLoading] = useState(true);

  const categorieId = searchParams.get('categorie');
  const recherche = searchParams.get('recherche');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (categorieId) params.categorie = categorieId;
    if (recherche) params.recherche = recherche;

    getArtisans(params).then((data) => {
      setArtisans(data);
      setLoading(false);
    });
  }, [categorieId, recherche]);

  useEffect(() => {
    if (categorieId) {
      getCategories().then((categories) => {
        const categorie = categories.find((element) => element.id === Number(categorieId));
        if (categorie) {
          const nouveauTitre = titresCategorie[categorie.nom] || `Les Artisans – ${categorie.nom}`;
          setTitre(nouveauTitre);
        }
      });
    } else {
      const nouveauTitre = recherche
        ? `Résultats pour "${recherche}"`
        : 'Nos Artisans';
      setTitre(nouveauTitre);
    }
  }, [categorieId, recherche]);

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
