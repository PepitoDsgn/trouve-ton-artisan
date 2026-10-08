import { useContext } from 'react';
import { FavorisContext } from '../context/FavorisContext';

/**
 * Logged-in member's favorites: { favoris, chargement, estFavori(id), basculerFavori(artisan) }.
 * Must be used inside <FavorisProvider>.
 */
function useFavoris() {
  return useContext(FavorisContext);
}

export default useFavoris;
