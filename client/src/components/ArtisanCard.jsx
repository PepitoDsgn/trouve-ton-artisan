import { useNavigate } from 'react-router-dom';

function ArtisanCard({ artisan }) {
  const navigate = useNavigate();

  return (
    <article
      className="artisan-card"
      onClick={() => navigate(`/artisans/${artisan.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`Voir le profil de ${artisan.nom}`}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/artisans/${artisan.id}`)}
    >
      {artisan.image ? (
        <img
          src={artisan.image}
          alt={artisan.nom}
          className="artisan-card-img"
        />
      ) : (
        <div
          className="artisan-card-img d-flex align-items-center justify-content-center bg-secondary"
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
    </article>
  );
}

export default ArtisanCard;
