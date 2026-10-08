import { useEffect, useState } from 'react';
import { getArtisan } from '../services/api';

/**
 * Loads one artisan by id.
 * @param {string} id Route parameter.
 * @returns {{ artisan: object|null, notFound: boolean }}
 */
function useArtisan(id) {
  const [artisan, setArtisan] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let ignore = false;

    getArtisan(id)
      .then((data) => {
        if (!ignore) setArtisan(data);
      })
      .catch(() => {
        if (!ignore) setNotFound(true);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  return { artisan, notFound };
}

export default useArtisan;
