import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { ajouterFavori, getFavoris, retirerFavori } from '../services/api';

export const FavorisContext = createContext(null);

// Favoris du membre connecté, partagés entre les cartes, la fiche et la page
// « Mes favoris ». Les changements sont appliqués tout de suite à l'écran,
// puis annulés si l'API échoue.
export function FavorisProvider({ children }) {
  const { utilisateur } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [chargement, setChargement] = useState(false);

  useEffect(() => {
    if (!utilisateur) {
      setFavoris([]);
      return;
    }

    let ignore = false;
    setChargement(true);
    getFavoris()
      .then((data) => {
        if (!ignore) setFavoris(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setChargement(false);
      });

    return () => {
      ignore = true;
    };
  }, [utilisateur]);

  const idsFavoris = useMemo(() => new Set(favoris.map((artisan) => artisan.id)), [favoris]);

  const basculerFavori = useCallback(async (artisan) => {
    const etaitFavori = idsFavoris.has(artisan.id);
    const precedents = favoris;

    setFavoris(etaitFavori
      ? favoris.filter((favori) => favori.id !== artisan.id)
      : [...favoris, artisan].sort((a, b) => a.nom.localeCompare(b.nom)));

    try {
      await (etaitFavori ? retirerFavori(artisan.id) : ajouterFavori(artisan.id));
    } catch {
      setFavoris(precedents);
    }
  }, [favoris, idsFavoris]);

  const value = useMemo(
    () => ({ favoris, chargement, estFavori: (id) => idsFavoris.has(id), basculerFavori }),
    [favoris, chargement, idsFavoris, basculerFavori]
  );

  return <FavorisContext.Provider value={value}>{children}</FavorisContext.Provider>;
}
