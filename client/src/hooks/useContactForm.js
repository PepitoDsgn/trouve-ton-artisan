import { useState } from 'react';
import { sendContact } from '../services/api';
import { validateContactForm } from '../utils/contactValidation';

const formulaireVide = { nom: '', email: '', objet: '', message: '' };

function useContactForm(artisanId) {
  const [form, setForm] = useState(formulaireVide);
  const [statut, setStatut] = useState(null);

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const erreur = validateContactForm(form);
    if (erreur) {
      setStatut(erreur);
      return;
    }

    try {
      await sendContact(artisanId, form);
      setStatut('success');
      setForm(formulaireVide);
    } catch {
      setStatut('error');
    }
  };

  const resetStatut = () => setStatut(null);

  return { form, statut, handleChange, handleSubmit, resetStatut };
}

export default useContactForm;
