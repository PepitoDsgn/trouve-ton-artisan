import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import NotFound from '../pages/NotFound';

// Réserve une page aux membres connectés (et à un rôle précis si role est fourni).
// Un visiteur non connecté est envoyé vers /connexion, puis ramené ici.
function ProtectedRoute({ children, role }) {
  const { utilisateur, chargement } = useAuth();
  const location = useLocation();

  if (chargement) return <div className="container py-5 text-center">Chargement...</div>;
  if (!utilisateur) return <Navigate to="/connexion" replace state={{ from: location }} />;
  if (role && utilisateur.role !== role) return <NotFound />;

  return children;
}

export default ProtectedRoute;
