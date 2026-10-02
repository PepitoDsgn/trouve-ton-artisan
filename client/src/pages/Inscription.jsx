import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuth from '../hooks/useAuth';
import useAuthForm from '../hooks/useAuthForm';
import { validateInscription } from '../utils/authValidation';
import { destinationApresConnexion } from '../utils/redirection';

function Inscription() {
  const { utilisateur, inscription } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = destinationApresConnexion(location);

  const { form, erreur, envoi, handleChange, handleSubmit } = useAuthForm({
    champsInitiaux: { email: '', motDePasse: '', confirmation: '' },
    valider: validateInscription,
    soumettre: async (champs) => {
      await inscription({ email: champs.email.trim(), motDePasse: champs.motDePasse });
      navigate(destination, { replace: true });
    },
  });

  if (utilisateur && !envoi) return <Navigate to={destination} replace />;

  return (
    <div className="container py-5">
      <Helmet>
        <title>Créer un compte – Trouve ton artisan !</title>
        <meta name="description" content="Créez votre compte gratuit sur Trouve ton artisan ! pour accéder aux artisans et enregistrer vos favoris." />
      </Helmet>

      <section className="auth-section" aria-labelledby="titre-inscription">
        <h1 id="titre-inscription" className="section-title mb-4">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {erreur && <p className="auth-erreur" role="alert">{erreur}</p>}

          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="motDePasse">Mot de passe</label>
            <input
              id="motDePasse"
              name="motDePasse"
              type="password"
              autoComplete="new-password"
              className="form-control"
              aria-describedby="aide-mot-de-passe"
              value={form.motDePasse}
              onChange={handleChange}
              required
            />
            <p id="aide-mot-de-passe" className="auth-aide">
              8 caractères minimum, avec au moins une lettre et un chiffre.
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmation">Confirmer le mot de passe</label>
            <input
              id="confirmation"
              name="confirmation"
              type="password"
              autoComplete="new-password"
              className="form-control"
              value={form.confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <p className="auth-aide mb-4">
            Votre email sert uniquement à vous connecter. Vous pouvez supprimer votre compte
            à tout moment.{' '}
            <Link to="/donnees-personnelles" className="text-white">En savoir plus</Link>
          </p>

          <div className="text-center">
            <button type="submit" className="btn-envoyer" disabled={envoi}>
              {envoi ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          Déjà inscrit ? <Link to="/connexion" state={location.state}>Se connecter</Link>
        </p>
      </section>
    </div>
  );
}

export default Inscription;
