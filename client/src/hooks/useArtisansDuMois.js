import { useEffect, useState } from 'react';
import { getArtisansDuMois } from '../services/api';

// actif = false : pas de requête (visiteur non connecté, l'API répondrait 401)
function useArtisansDuMois(actif = true) {
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    if (!actif) {
      setArtisans([]);
      return;
    }
    getArtisansDuMois().then(setArtisans);
  }, [actif]);

  return artisans;
}

export default useArtisansDuMois;
