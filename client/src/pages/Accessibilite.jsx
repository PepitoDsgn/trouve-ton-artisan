import { Helmet } from 'react-helmet-async';

function Accessibilite() {
  return (
    <div className="container py-5 page-legale">
      <Helmet>
        <title>Accessibilité – Trouve ton artisan !</title>
        <meta name="description" content="Démarche d'accessibilité de Trouve ton artisan ! : mesures mises en œuvre et limites connues." />
      </Helmet>
      <h1 className="section-title mb-5">Accessibilité</h1>

      <section aria-labelledby="etat">
        <h2 id="etat" className="h4">État de conformité</h2>
        <p>
          Le site a été conçu en suivant les recommandations WCAG 2.1. Il n'a pas fait
          l'objet d'un audit de conformité RGAA : aucun taux de conformité n'est donc
          déclaré.
        </p>
      </section>

      <section aria-labelledby="mesures">
        <h2 id="mesures" className="h4">Mesures mises en œuvre</h2>
        <ul>
          <li>Lien « Aller au contenu principal » en tête de page, visible au clavier.</li>
          <li>Hiérarchie de titres respectée sur chaque page, et titre de page propre à chaque écran.</li>
          <li>Champs de formulaire associés à leur libellé ; messages d'erreur annoncés aux lecteurs d'écran.</li>
          <li>Boutons favoris avec un libellé explicite et un état « activé / désactivé » annoncé.</li>
          <li>Site entièrement utilisable au clavier, y compris le menu mobile.</li>
          <li>Images informatives dotées d'un texte alternatif ; images décoratives masquées aux lecteurs d'écran.</li>
          <li>Conception mobile first, utilisable de 320 px à grand écran.</li>
        </ul>
      </section>

      <section aria-labelledby="limites">
        <h2 id="limites" className="h4">Limites connues</h2>
        <ul>
          <li>Les tableaux de l'espace administrateur défilent horizontalement sur mobile.</li>
          <li>Les confirmations de suppression utilisent la boîte de dialogue du navigateur.</li>
        </ul>
      </section>

      <section aria-labelledby="recours">
        <h2 id="recours" className="h4">Voies de recours</h2>
        <p>
          Si vous rencontrez un défaut d'accessibilité qui vous empêche d'accéder à un
          contenu, vous pouvez saisir le Défenseur des droits (
          <a href="https://www.defenseurdesdroits.fr" target="_blank" rel="noopener noreferrer">
            defenseurdesdroits.fr
          </a>
          ).
        </p>
      </section>
    </div>
  );
}

export default Accessibilite;
