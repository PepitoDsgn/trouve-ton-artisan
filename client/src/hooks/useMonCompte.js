import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { getMesDonnees, messageErreur } from '../services/api';

// Page « Mon compte » : export des données et suppression du compte
function useMonCompte() {
  const { supprimerCompte } = useAuth();
  const navigate = useNavigate();
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreurExport, setErreurExport] = useState(null);

  const telechargerDonnees = async () => {
    setErreurExport(null);
    try {
      const fichier = await getMesDonnees();
      const url = URL.createObjectURL(fichier);
      const lien = document.createElement('a');
      lien.href = url;
      lien.download = 'mes-donnees-trouve-ton-artisan.json';
      lien.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setErreurExport(messageErreur(error));
    }
  };

  const handleSupprimer = async (event) => {
    event.preventDefault();

    if (!motDePasse) {
      setErreur('Saisissez votre mot de passe pour confirmer.');
      return;
    }
    if (!window.confirm('Supprimer définitivement votre compte, vos favoris et vos messages ?')) {
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      await supprimerCompte(motDePasse);
      navigate('/', { replace: true, state: { compteSupprime: true } });
    } catch (error) {
      setErreur(messageErreur(error));
      setEnvoi(false);
    }
  };

  return {
    motDePasse,
    setMotDePasse,
    erreur,
    envoi,
    erreurExport,
    telechargerDonnees,
    handleSupprimer,
  };
}

export default useMonCompte;
