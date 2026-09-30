import { useEffect, useState } from 'react';
import { getArtisan } from '../services/api';

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
