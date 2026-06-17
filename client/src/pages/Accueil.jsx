import { useEffect, useState } from 'react';
import axios from 'axios';
import ArtisanCard from '../components/ArtisanCard';

const etapes = [
  { num: 1, texte: "Choisir une Catégorie d'Artisan dans le menu" },
  { num: 2, texte: 'Choisir un Artisan' },
  { num: 3, texte: 'Le contacter via le formulaire' },
  { num: 4, texte: 'Une réponse sera apportée sous 48h' },
];

function Accueil() {
  const [artisansDuMois, setArtisansDuMois] = useState([]);

  useEffect(() => {
    axios.get('/api/artisans/du-mois').then((res) => setArtisansDuMois(res.data));
  }, []);

  useEffect(() => {
    document.title = 'Trouve ton artisan ! – Auvergne-Rhône-Alpes';
  }, []);

  return (
    <>
      <div className="container py-5">
        <section aria-labelledby="comment-trouver">
          <h1 id="comment-trouver" className="section-title mb-5">
            Comment trouver mon Artisan ?
          </h1>

          {/* Desktop / tablette : grands chiffres */}
          <div className="d-none d-sm-block mb-5">
            <div className="row text-center">
              {etapes.map((e) => (
                <div key={e.num} className="col-6 col-md-3">
                  <div className="how-to-number">{e.num}</div>
                  <p className="mt-2" style={{ fontSize: '0.9rem' }}>{e.texte}</p>
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
              {etapes.map((e) => (
                <p key={e.num} className={e.num < 4 ? 'mb-4' : 'mb-0'}>
                  <strong style={{ color: '#0074c7' }}>{e.num}.</strong>{' '}
                  {e.texte}
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
              {artisansDuMois.map((a) => (
                <div key={a.id} className="col-lg-4">
                  <ArtisanCard artisan={a} />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile + tablette (<992px) : scroll horizontal natif */}
          <div className="d-lg-none artisans-carousel" aria-label="Artisans du mois">
            {artisansDuMois.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Accueil;
