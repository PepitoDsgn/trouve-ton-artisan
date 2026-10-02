import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function DonneesPersonnelles() {
  return (
    <div className="container py-5 page-legale">
      <Helmet>
        <title>Données personnelles – Trouve ton artisan !</title>
        <meta name="description" content="Quelles données personnelles Trouve ton artisan ! collecte, pourquoi, combien de temps, et comment exercer vos droits." />
      </Helmet>
      <h1 className="section-title mb-5">Données personnelles</h1>

      <section aria-labelledby="donnees-collectees">
        <h2 id="donnees-collectees" className="h4">Données collectées et finalités</h2>
        <ul>
          <li>
            <strong>Compte membre</strong> : votre adresse email et votre mot de passe,
            pour vous permettre de vous connecter. Le mot de passe est stocké sous forme
            chiffrée (hachage bcrypt) : personne, pas même l'administrateur, ne peut le lire.
          </li>
          <li>
            <strong>Favoris</strong> : la liste des artisans que vous avez enregistrés,
            pour vous les afficher dans « Mes favoris ».
          </li>
          <li>
            <strong>Messages de contact</strong> : votre nom, votre email, l'objet et le
            texte du message, pour transmettre votre demande à l'artisan concerné.
          </li>
        </ul>
        <p>
          Ces données ne sont ni vendues, ni utilisées à des fins publicitaires. Elles sont
          traitées pour exécuter le service que vous demandez (RGPD, article 6.1.b).
        </p>
      </section>

      <section aria-labelledby="destinataires">
        <h2 id="destinataires" className="h4">Destinataires</h2>
        <p>
          Vos messages sont envoyés par email à l'artisan que vous contactez. Ils sont
          également consultables par l'administrateur de la plateforme.
        </p>
      </section>

      <section aria-labelledby="conservation">
        <h2 id="conservation" className="h4">Durée de conservation</h2>
        <ul>
          <li>Compte et favoris : tant que votre compte existe.</li>
          <li>Messages de contact : 12 mois après leur envoi, puis suppression automatique.</li>
        </ul>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies" className="h4">Cookies</h2>
        <p>
          Le site n'utilise qu'un seul cookie, strictement nécessaire : le cookie de session
          qui vous garde connecté pendant 2 heures. Il ne sert à aucun suivi et n'est pas
          lisible par les scripts de la page. Aucun cookie publicitaire ou de mesure
          d'audience n'est déposé.
        </p>
      </section>

      <section aria-labelledby="droits">
        <h2 id="droits" className="h4">Vos droits</h2>
        <p>Depuis la page <Link to="/compte">Mon compte</Link>, vous pouvez à tout moment :</p>
        <ul>
          <li><strong>accéder</strong> à vos données en les téléchargeant (fichier JSON) ;</li>
          <li><strong>supprimer</strong> votre compte, vos favoris et vos messages.</li>
        </ul>
        <p>
          Vous pouvez également introduire une réclamation auprès de la CNIL
          (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>
      </section>
    </div>
  );
}

export default DonneesPersonnelles;
