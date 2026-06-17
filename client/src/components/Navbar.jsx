import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

function BurgerIcon({ open }) {
  return (
    <div className={`burger-icon${open ? ' open' : ''}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function Navbar() {
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categorieActive = searchParams.get('categorie')
    ? Number(searchParams.get('categorie'))
    : null;

  useEffect(() => {
    axios.get('/api/categories').then((res) => setCategories(res.data));
  }, []);

  const handleCategorie = (id) => {
    setMenuOpen(false);
    navigate(`/artisans?categorie=${id}`);
  };

  const handleAccueil = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar-artisan px-3 px-md-4 py-2" aria-label="Navigation principale">
      <div className="d-flex justify-content-between align-items-center">
        <a
          href="/"
          className="text-decoration-none"
          aria-label="Accueil – Trouve ton artisan !"
          onClick={handleAccueil}
        >
          <div className="navbar-logo">
            <img src={logo} alt="Trouve ton artisan !" height="62" />
          </div>
        </a>

        {/* Desktop nav */}
        <div className="d-none d-md-flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn-categorie${categorieActive === cat.id ? ' active' : ''}`}
              onClick={() => handleCategorie(cat.id)}
              aria-pressed={categorieActive === cat.id}
            >
              {cat.nom}
            </button>
          ))}
        </div>

        {/* Burger button */}
        <button
          className="d-md-none burger-btn"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <BurgerIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile menu déroulant */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <div className="mobile-menu-inner">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`btn-categorie-mobile${categorieActive === cat.id ? ' active' : ''}`}
              onClick={() => handleCategorie(cat.id)}
              aria-pressed={categorieActive === cat.id}
            >
              {cat.nom}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
