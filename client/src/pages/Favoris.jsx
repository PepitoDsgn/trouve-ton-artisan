import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ArtisanCard from '../components/ArtisanCard';
import useFavoris from '../hooks/useFavoris';

function Favoris() {
  const { favoris, chargement } = useFavoris();

  return (
    <div className="container py-5">
      <Helmet>
        <title>Mes favoris – Trouve ton artisan !</title>
        <meta name="description" content="Retrouvez les artisans que vous avez enregistrés en favoris sur Trouve ton artisan !." />
      </Helmet>
      <h1 className="section-title mb-5">Mes favoris</h1>

      {chargement ? (
        <p className="text-center">Chargement...</p>
      ) : favoris.length === 0 ? (
        <div className="text-center">
          <p className="text-muted mb-4">
            Vous n'avez pas encore d'artisan favori. Cliquez sur ♡ sur la fiche
            d'un artisan pour l'enregistrer ici.
          </p>
          <Link to="/artisans" className="btn btn-primary rounded-pill px-4 py-2 fw-bold">
            Voir les artisans
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {favoris.map((artisan) => (
            <div key={artisan.id} className="col-12 col-md-6 col-lg-3">
              <ArtisanCard artisan={artisan} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favoris;
