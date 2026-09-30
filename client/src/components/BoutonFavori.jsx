import useFavoris from '../hooks/useFavoris';

function BoutonFavori({ artisan, className = '' }) {
  const { estFavori, basculerFavori } = useFavoris();
  const actif = estFavori(artisan.id);

  return (
    <button
      type="button"
      className={`btn-favori${actif ? ' actif' : ''} ${className}`}
      onClick={() => basculerFavori(artisan)}
      aria-pressed={actif}
      aria-label={actif ? `Retirer ${artisan.nom} des favoris` : `Ajouter ${artisan.nom} aux favoris`}
      title={actif ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <span aria-hidden="true">{actif ? '♥' : '♡'}</span>
    </button>
  );
}

export default BoutonFavori;
