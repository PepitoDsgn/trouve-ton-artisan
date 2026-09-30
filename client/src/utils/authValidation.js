const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mêmes règles que l'API : le serveur reste la référence, ceci évite un aller-retour
export const validateConnexion = ({ email, motDePasse }) => {
  if (!email.trim() || !motDePasse) return 'Veuillez saisir votre email et votre mot de passe.';
  if (!emailRegex.test(email.trim())) return "L'adresse email saisie n'est pas valide.";
  return null;
};

export const validateInscription = ({ email, motDePasse, confirmation }) => {
  if (!email.trim() || !motDePasse || !confirmation) return 'Veuillez remplir tous les champs.';
  if (!emailRegex.test(email.trim())) return "L'adresse email saisie n'est pas valide.";
  if (motDePasse.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
  if (!/[a-zA-Z]/.test(motDePasse) || !/\d/.test(motDePasse)) {
    return 'Le mot de passe doit contenir au moins une lettre et un chiffre.';
  }
  if (motDePasse !== confirmation) return 'Les deux mots de passe ne correspondent pas.';
  return null;
};
