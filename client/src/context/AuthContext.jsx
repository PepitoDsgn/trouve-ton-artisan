import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  connexion as apiConnexion,
  deconnexion as apiDeconnexion,
  getMoi,
  inscription as apiInscription,
  surSessionExpiree,
} from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Au chargement de l'app : restaure la session à partir du cookie
  useEffect(() => {
    getMoi()
      .then(setUtilisateur)
      .catch(() => setUtilisateur(null))
      .finally(() => setChargement(false));
  }, []);

  useEffect(() => surSessionExpiree(() => setUtilisateur(null)), []);

  const connexion = useCallback(async (identifiants) => {
    const connecte = await apiConnexion(identifiants);
    setUtilisateur(connecte);
    return connecte;
  }, []);

  const inscription = useCallback(async (identifiants) => {
    const inscrit = await apiInscription(identifiants);
    setUtilisateur(inscrit);
    return inscrit;
  }, []);

  const deconnexion = useCallback(async () => {
    await apiDeconnexion();
    setUtilisateur(null);
  }, []);

  const value = useMemo(
    () => ({ utilisateur, chargement, connexion, inscription, deconnexion }),
    [utilisateur, chargement, connexion, inscription, deconnexion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
