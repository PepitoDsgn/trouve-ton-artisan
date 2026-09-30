const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Retourne le code d'erreur à afficher, ou null si le formulaire est valide.
export const validateContactForm = (form) => {
  if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
    return 'validation';
  }
  if (!emailRegex.test(form.email)) {
    return 'emailInvalid';
  }
  return null;
};
