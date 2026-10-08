import { useState } from 'react';
import { messageErreur } from '../services/api';

/**
 * Generic login / sign-up form: field state, local validation, submission
 * and API error message.
 * @param {{ champsInitiaux: object, valider: (form: object) => string|null,
 *   soumettre: (form: object) => Promise<void> }} options
 * @returns {{ form: object, erreur: string|null, envoi: boolean,
 *   handleChange: Function, handleSubmit: Function }}
 */
function useAuthForm({ champsInitiaux, valider, soumettre }) {
  const [form, setForm] = useState(champsInitiaux);
  const [erreur, setErreur] = useState(null);
  const [envoi, setEnvoi] = useState(false);

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const erreurLocale = valider(form);
    if (erreurLocale) {
      setErreur(erreurLocale);
      return;
    }

    setErreur(null);
    setEnvoi(true);
    try {
      await soumettre(form);
    } catch (error) {
      setErreur(messageErreur(error));
      setEnvoi(false);
    }
  };

  return { form, erreur, envoi, handleChange, handleSubmit };
}

export default useAuthForm;
