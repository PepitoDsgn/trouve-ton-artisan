const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mêmes règles que l'API admin. Retourne le premier message d'erreur, ou null.
export const validateArtisan = (form) => {
  if (!form.nom.trim()) return 'Le nom est obligatoire.';
  if (!form.specialiteId) return 'La spécialité est obligatoire.';
  if (!emailRegex.test(form.email.trim())) return "L'email n'est pas valide.";
  if (!form.ville.trim()) return 'La ville est obligatoire.';
  if (form.telephone.trim() && !/^0\d{9}$/.test(form.telephone.trim())) {
    return 'Le téléphone doit contenir 10 chiffres et commencer par 0.';
  }
  if (form.codePostal.trim() && !/^\d{5}$/.test(form.codePostal.trim())) {
    return 'Le code postal doit contenir 5 chiffres.';
  }
  if (form.image.trim() && !/^(https:\/\/|\/images\/)/.test(form.image.trim())) {
    return "L'image doit être une URL https ou un chemin /images/...";
  }
  return null;
};

export const formulaireArtisanVide = {
  nom: '',
  specialiteId: '',
  email: '',
  telephone: '',
  adresse: '',
  codePostal: '',
  ville: '',
  description: '',
  image: '',
  artisanDuMois: false,
};

// Artisan de l'API → champs du formulaire (les null deviennent des chaînes vides)
export const versFormulaire = (artisan) =>
  Object.fromEntries(
    Object.entries(formulaireArtisanVide).map(([champ, defaut]) => [champ, artisan[champ] ?? defaut])
  );

// Champs du formulaire → corps de requête (textes nettoyés, id numérique)
export const versDonnees = (form) => ({
  ...Object.fromEntries(
    Object.entries(form).map(([champ, valeur]) => [champ, typeof valeur === 'string' ? valeur.trim() : valeur])
  ),
  specialiteId: Number(form.specialiteId),
});
