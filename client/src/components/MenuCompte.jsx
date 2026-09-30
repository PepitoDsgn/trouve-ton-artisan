import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

// Liens du compte dans la navbar. variante = 'desktop' (boutons pilule)
// ou 'mobile' (lignes pleine largeur du menu burger).
function MenuCompte({ variante, onNavigate }) {
  const { utilisateur, deconnexion } = useAuth();
  const navigate = useNavigate();
  const classe = variante === 'mobile' ? 'btn-categorie-mobile' : 'btn-compte';

  const handleDeconnexion = async () => {
    onNavigate?.();
    await deconnexion();
    navigate('/');
  };

  if (!utilisateur) {
    return (
      <Link to="/connexion" className={classe} onClick={onNavigate}>
        Connexion
      </Link>
    );
  }

  return (
    <>
      <NavLink to="/favoris" className={classe} onClick={onNavigate}>
        Mes favoris
      </NavLink>
      <button type="button" className={classe} onClick={handleDeconnexion}>
        Déconnexion
      </button>
    </>
  );
}

export default MenuCompte;
