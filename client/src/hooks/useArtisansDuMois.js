import { useEffect, useState } from 'react';
import { getArtisansDuMois } from '../services/api';

function useArtisansDuMois() {
  const [artisans, setArtisans] = useState([]);

  useEffect(() => {
    getArtisansDuMois().then(setArtisans);
  }, []);

  return artisans;
}

export default useArtisansDuMois;
