// « Électricien » → « electricien » (même règle que le seed côté serveur)
export const slugify = (texte) =>
  texte
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const imageSpecialite = (nomSpecialite) => `/images/specialites/${slugify(nomSpecialite)}.svg`;
