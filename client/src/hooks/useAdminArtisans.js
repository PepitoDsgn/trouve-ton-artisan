import { useCallback, useEffect, useState } from 'react';
import {
  adminModifierArtisan,
  adminSupprimerArtisan,
  getArtisans,
  messageErreur,
} from '../services/api';

// Liste des artisans pour l'admin, avec suppression et bascule « artisan du mois ».
// notification : { type, message } à afficher dans un Toast.
function useAdminArtisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const recharger = useCallback(() => {
    setLoading(true);
    return getArtisans()
      .then(setArtisans)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    recharger();
  }, [recharger]);

  const supprimer = async (artisan) => {
    try {
      await adminSupprimerArtisan(artisan.id);
      setArtisans((liste) => liste.filter((element) => element.id !== artisan.id));
      setNotification({ type: 'success', message: `${artisan.nom} a été supprimé.` });
    } catch (error) {
      setNotification({ type: 'error', message: messageErreur(error) });
    }
  };

  const basculerDuMois = async (artisan) => {
    try {
      const modifie = await adminModifierArtisan(artisan.id, { artisanDuMois: !artisan.artisanDuMois });
      setArtisans((liste) => liste.map((element) => (element.id === modifie.id ? modifie : element)));
    } catch (error) {
      setNotification({ type: 'warning', message: messageErreur(error) });
    }
  };

  const fermerNotification = useCallback(() => setNotification(null), []);

  return { artisans, loading, notification, supprimer, basculerDuMois, fermerNotification };
}

export default useAdminArtisans;
