import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ArtisanCard from '../components/ArtisanCard';

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

    axios.get('/api/artisans', { params }).then((res) => {
      setArtisans(res.data);
      setLoading(false);
    });
  }, [categorieId, recherche]);

  useEffect(() => {
    if (categorieId) {
      axios.get('/api/categories').then((res) => {
        const cat = res.data.find((c) => c.id === Number(categorieId));
        if (cat) {
          const t = titresCategorie[cat.nom] || `Les Artisans – ${cat.nom}`;
          setTitre(t);
          document.title = `${t} – Trouve ton artisan !`;
        }
      });
    } else {
      const t = recherche
        ? `Résultats pour "${recherche}"`
        : 'Nos Artisans';
      setTitre(t);
      document.title = `${t} – Trouve ton artisan !`;
    }
  }, [categorieId, recherche]);

  return (
    <div className="container py-5">
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
              {artisans.map((a) => (
                <div key={a.id} className="col-lg-3">
                  <ArtisanCard artisan={a} />
                </div>
              ))}
            </div>
          </div>

          {/* Tablette (768-991px) : grille 2 colonnes */}
          <div className="d-none d-md-block d-lg-none">
            <div className="row g-4">
              {artisans.map((a) => (
                <div key={a.id} className="col-6">
                  <ArtisanCard artisan={a} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile (<768px) : scroll horizontal natif */}
          <div className="d-md-none artisans-carousel" aria-label="Liste des artisans">
            {artisans.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListeArtisans;
