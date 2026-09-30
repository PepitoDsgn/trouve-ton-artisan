// Page demandée avant la redirection vers /connexion, sinon l'accueil
export const destinationApresConnexion = (location) => {
  const from = location.state?.from;
  return from ? `${from.pathname}${from.search}` : '/';
};
