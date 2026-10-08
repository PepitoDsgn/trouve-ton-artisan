import { useEffect, useState } from 'react';
import { getArtisansDuMois } from '../services/api';

/**
 * Loads the artisans of the month.
 * @param {boolean} [actif=true] false = no request (logged-out visitor: the API would answer 401).
 * @returns {object[]}
 */
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
