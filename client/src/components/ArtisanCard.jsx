import { Link } from 'react-router-dom';
import BoutonFavori from './BoutonFavori';

function ArtisanCard({ artisan }) {
  return (
    // Le bouton favori est à côté du lien, pas dedans : un bouton ne peut pas
    // être imbriqué dans un lien (HTML invalide, et inutilisable au clavier)
    <div className="artisan-card-wrapper">
      <Link
        to={`/artisans/${artisan.id}`}
        className="artisan-card"
        aria-label={`Voir le profil de ${artisan.nom}`}
      >
        {artisan.image ? (
          <img
            src={artisan.image}
            alt={artisan.nom}
            className="artisan-card-img"
          />
        ) : (
          <div
            className="artisan-card-img d-flex align-items-center justify-content-center image-absente"
            aria-hidden="true"
            style={{ aspectRatio: '4/3' }}
          >
            <span style={{ fontSize: '3rem' }}>🔨</span>
          </div>
        )}
        <div className="artisan-card-body">
          <p className="artisan-card-nom">{artisan.nom}</p>
          <p className="artisan-card-stars mb-1">⭐⭐⭐⭐⭐ <span className="text-muted">(5/5)</span></p>
          {artisan.Specialite && (
            <p className="artisan-card-specialite mb-1">{artisan.Specialite.nom}</p>
          )}
          <p className="artisan-card-ville mb-0">{artisan.ville}</p>
        </div>
      </Link>
      <BoutonFavori artisan={artisan} className="btn-favori-carte" />
    </div>
  );
}

export default ArtisanCard;
