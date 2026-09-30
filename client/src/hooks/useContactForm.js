import { useState } from 'react';
import { sendContact } from '../services/api';
import { validateContactForm } from '../utils/contactValidation';

const formulaireVide = (email) => ({ nom: '', email, objet: '', message: '' });

// emailParDefaut : email du membre connecté, pré-rempli et modifiable
function useContactForm(artisanId, emailParDefaut = '') {
  const [form, setForm] = useState(() => formulaireVide(emailParDefaut));
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
      setForm(formulaireVide(emailParDefaut));
    } catch {
      setStatut('error');
    }
  };

  const resetStatut = () => setStatut(null);

  return { form, statut, handleChange, handleSubmit, resetStatut };
}

export default useContactForm;
