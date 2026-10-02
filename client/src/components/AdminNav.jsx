import { Link, NavLink, useLocation } from 'react-router-dom';

function AdminNav() {
  const { pathname } = useLocation();
  // « Artisans » reste actif sur la liste, l'ajout et la modification
  const surMessages = pathname.startsWith('/admin/messages');

  return (
    <nav className="admin-nav mb-4" aria-label="Espace administrateur">
      <Link
        to="/admin"
        className={`admin-nav-lien${surMessages ? '' : ' active'}`}
        aria-current={surMessages ? undefined : 'page'}
      >
        Artisans
      </Link>
      <NavLink to="/admin/messages" className="admin-nav-lien">Messages</NavLink>
    </nav>
  );
}

export default AdminNav;
