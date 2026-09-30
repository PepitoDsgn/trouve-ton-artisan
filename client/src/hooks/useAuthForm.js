import { useState } from 'react';
import { messageErreur } from '../services/api';

// Formulaire de connexion / inscription : état des champs, validation locale,
// envoi et message d'erreur de l'API.
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
