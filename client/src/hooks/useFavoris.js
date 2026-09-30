import { useContext } from 'react';
import { FavorisContext } from '../context/FavorisContext';

function useFavoris() {
  return useContext(FavorisContext);
}

export default useFavoris;
