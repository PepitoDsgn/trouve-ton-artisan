import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function MentionsLegales() {
  return (
    <div className="container py-5 page-legale">
      <Helmet>
        <title>Mentions légales – Trouve ton artisan !</title>
        <meta name="description" content="Mentions légales de Trouve ton artisan ! : nature du site, sources des données, propriété des contenus." />
      </Helmet>
      <h1 className="section-title mb-5">Mentions légales</h1>

      <section aria-labelledby="nature">
        <h2 id="nature" className="h4">Nature du site</h2>
        <p>
          Trouve ton artisan ! est un projet pédagogique réalisé dans le cadre de la
          préparation au titre professionnel Développeur Web et Web Mobile. Il n'a pas de
          vocation commerciale.
        </p>
      </section>

      <section aria-labelledby="hebergement">
        <h2 id="hebergement" className="h4">Hébergement</h2>
        <p>
          Le site est exécuté en local pour sa démonstration : il n'est pas hébergé
          publiquement.
        </p>
      </section>

      <section aria-labelledby="sources">
        <h2 id="sources" className="h4">Sources des données</h2>
        <p>
          Une partie des artisans présentés provient de l'API publique « Recherche
          d'entreprises » de l'État (
          <a href="https://recherche-entreprises.api.gouv.fr" target="_blank" rel="noopener noreferrer">
            recherche-entreprises.api.gouv.fr
          </a>
          ), dont les données sont diffusées sous Licence Ouverte. Les descriptions et les
          adresses email de ces artisans sont fictives : aucun message n'est transmis à une
          entreprise réelle.
        </p>
      </section>

      <section aria-labelledby="contenus">
        <h2 id="contenus" className="h4">Contenus</h2>
        <p>
          Les illustrations des spécialités ont été créées pour le projet. Le traitement
          des données personnelles est décrit sur la page{' '}
          <Link to="/donnees-personnelles">Données personnelles</Link>.
        </p>
      </section>
    </div>
  );
}

export default MentionsLegales;
