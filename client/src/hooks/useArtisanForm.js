import { useEffect, useState } from 'react';
import {
  adminCreerArtisan,
  adminGetArtisan,
  adminGetSpecialites,
  adminModifierArtisan,
  messageErreur,
} from '../services/api';
import {
  formulaireArtisanVide,
  validateArtisan,
  versDonnees,
  versFormulaire,
} from '../utils/artisanValidation';
import { imageSpecialite } from '../utils/slugify';

/**
 * Admin artisan form: creation (no id) or edition. Picks the specialty
 * illustration automatically unless a custom image was entered.
 * @param {string} [id] Artisan id to edit.
 * @param {{ onSucces: (artisan: object) => void }} options
 * @returns {{ form: object, specialites: object[], chargement: boolean, introuvable: boolean,
 *   erreur: string|null, envoi: boolean, handleChange: Function, handleSubmit: Function }}
 */
function useArtisanForm(id, { onSucces }) {
  const [form, setForm] = useState(formulaireArtisanVide);
  const [specialites, setSpecialites] = useState([]);
  const [chargement, setChargement] = useState(Boolean(id));
  const [introuvable, setIntrouvable] = useState(false);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    adminGetSpecialites().then(setSpecialites);
  }, []);

  useEffect(() => {
    if (!id) return;
    adminGetArtisan(id)
      .then((artisan) => setForm(versFormulaire(artisan)))
      .catch(() => setIntrouvable(true))
      .finally(() => setChargement(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;

    setForm((previous) => {
      const suivant = { ...previous, [name]: type === 'checkbox' ? checked : value };

      // Changement de spécialité : l'illustration suit, sauf image personnalisée
      if (name === 'specialiteId') {
        const imageAuto = !previous.image || previous.image.startsWith('/images/specialites/');
        const specialite = specialites.find((element) => element.id === Number(value));
        if (imageAuto && specialite) suivant.image = imageSpecialite(specialite.nom);
      }
      return suivant;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const erreurLocale = validateArtisan(form);
    if (erreurLocale) {
      setErreur(erreurLocale);
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      const donnees = versDonnees(form);
      const artisan = id ? await adminModifierArtisan(id, donnees) : await adminCreerArtisan(donnees);
      onSucces(artisan);
    } catch (error) {
      setErreur(messageErreur(error));
      setEnvoi(false);
    }
  };

  return { form, specialites, chargement, introuvable, erreur, envoi, handleChange, handleSubmit };
}

export default useArtisanForm;
