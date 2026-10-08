import { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

/**
 * Loads the categories for the navigation menu (public endpoint).
 * @returns {object[]}
 */
function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return categories;
}

export default useCategories;
