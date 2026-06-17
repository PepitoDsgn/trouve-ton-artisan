import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SearchBar() {
  const [searchParams] = useSearchParams();
  const [valeur, setValeur] = useState(searchParams.get('recherche') || '');
  const navigate = useNavigate();

  useEffect(() => {
    setValeur(searchParams.get('recherche') || '');
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (valeur.trim()) {
      params.set('recherche', valeur.trim());
    } else {
      params.delete('recherche');
    }
    navigate(`/artisans?${params.toString()}`);
  };

  return (
    <div className="searchbar-wrapper">
      <form onSubmit={handleSubmit} role="search">
        <label htmlFor="recherche-artisan" className="visually-hidden">
          Rechercher un artisan
        </label>
        <input
          id="recherche-artisan"
          type="search"
          className="searchbar-input"
          placeholder="🔍  Rechercher un Artisan..."
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
          aria-label="Rechercher un artisan"
        />
      </form>
    </div>
  );
}

export default SearchBar;
