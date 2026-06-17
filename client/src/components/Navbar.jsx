import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function Logo() {
  return (
    <div className="navbar-logo">
      <span className="logo-title">Trouve ton artisan !</span>
      <span className="logo-sub">Avec la région</span>
      <span className="logo-sub">Auvergne-Rhône-Alpes</span>
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

  return (
    <nav className="navbar-artisan px-3 px-md-4 py-3" aria-label="Navigation principale">
      <div className="d-flex justify-content-between align-items-center">
        <a
          href="/"
          className="text-decoration-none"
          aria-label="Accueil – Trouve ton artisan !"
          onClick={(e) => { e.preventDefault(); navigate('/'); }}
        >
          <Logo />
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

        {/* Mobile hamburger */}
        <button
          className="d-md-none btn p-0 border-0"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          style={{ background: 'none' }}
        >
          <span style={{ fontSize: '1.6rem', color: '#fff' }}>☰</span>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="d-md-none d-flex flex-column gap-2 mt-3">
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
      )}
    </nav>
  );
}

export default Navbar;
