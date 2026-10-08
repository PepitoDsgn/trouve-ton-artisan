import { useState } from 'react';
import { sendContact } from '../services/api';
import { validateContactForm } from '../utils/contactValidation';

const formulaireVide = (email) => ({ nom: '', email, objet: '', message: '' });

/**
 * Contact form state: client-side validation, sending and status message.
 * @param {string} artisanId
 * @param {string} [emailParDefaut] Logged-in member's email, pre-filled and editable.
 * @returns {{ form: object, statut: string|null, handleChange: Function,
 *   handleSubmit: Function, resetStatut: Function }}
 *   statut: 'success' | 'validation' | 'emailInvalid' | 'error' | null
 */
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
