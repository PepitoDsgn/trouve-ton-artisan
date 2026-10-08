import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Current session: { utilisateur, chargement, connexion, inscription, deconnexion, supprimerCompte }.
 * Must be used inside <AuthProvider>.
 */
function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
