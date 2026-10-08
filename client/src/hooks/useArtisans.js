import { useEffect, useState } from 'react';
import { getArtisans } from '../services/api';

/**
 * Loads the artisan list for a category and/or a name search.
 * Ignores late responses when the filters change quickly.
 * @param {{ categorie?: string|null, recherche?: string|null }} filtres
 * @returns {{ artisans: object[], loading: boolean }}
 */
function useArtisans({ categorie, recherche }) {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ignore la réponse d'une requête dépassée si les filtres changent entre-temps
    let ignore = false;
    setLoading(true);

    const params = {};
    if (categorie) params.categorie = categorie;
    if (recherche) params.recherche = recherche;

    getArtisans(params).then((data) => {
      if (ignore) return;
      setArtisans(data);
      setLoading(false);
    });

    return () => {
      ignore = true;
    };
  }, [categorie, recherche]);

  return { artisans, loading };
}

export default useArtisans;
