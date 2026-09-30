import { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return categories;
}

export default useCategories;
