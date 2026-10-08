import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { getMesDonnees, messageErreur } from '../services/api';

/**
 * "Mon compte" page: GDPR data export (JSON download) and account deletion
 * (password confirmation + browser confirm dialog).
 * @returns {{ motDePasse: string, setMotDePasse: Function, erreur: string|null, envoi: boolean,
 *   erreurExport: string|null, telechargerDonnees: Function, handleSupprimer: Function }}
 */
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
