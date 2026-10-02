import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Cookies() {
  return (
    <div className="container py-5 page-legale">
      <Helmet>
        <title>Cookies – Trouve ton artisan !</title>
        <meta name="description" content="Trouve ton artisan ! n'utilise qu'un cookie de session strictement nécessaire, sans suivi ni publicité." />
      </Helmet>
      <h1 className="section-title mb-5">Cookies</h1>

      <section aria-labelledby="cookie-utilise">
        <h2 id="cookie-utilise" className="h4">Le seul cookie utilisé</h2>
        <div className="table-responsive">
          <table className="table">
            <caption className="visually-hidden">Cookies déposés par le site</caption>
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Rôle</th>
                <th scope="col">Durée</th>
                <th scope="col">Déposé</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>token</code></td>
                <td>Vous garder connecté à votre compte</td>
                <td>2 heures, ou jusqu'à la déconnexion</td>
                <td>Uniquement après connexion ou inscription</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Ce cookie est inaccessible aux scripts de la page (<code>HttpOnly</code>) et n'est
          envoyé qu'au site lui-même (<code>SameSite=Lax</code>).
        </p>
      </section>

      <section aria-labelledby="consentement">
        <h2 id="consentement" className="h4">Pourquoi pas de bandeau de consentement ?</h2>
        <p>
          Ce cookie est strictement nécessaire au service que vous demandez (être connecté).
          Ce type de cookie est dispensé de consentement. Le site ne dépose aucun cookie
          publicitaire, de mesure d'audience ou de réseau social.
        </p>
        <p>
          Pour en savoir plus sur vos données : <Link to="/donnees-personnelles">Données personnelles</Link>.
        </p>
      </section>
    </div>
  );
}

export default Cookies;
