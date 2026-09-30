import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuth from '../hooks/useAuth';
import useAuthForm from '../hooks/useAuthForm';
import { validateConnexion } from '../utils/authValidation';
import { destinationApresConnexion } from '../utils/redirection';

function Connexion() {
  const { utilisateur, connexion } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const destination = destinationApresConnexion(location);

  const { form, erreur, envoi, handleChange, handleSubmit } = useAuthForm({
    champsInitiaux: { email: '', motDePasse: '' },
    valider: validateConnexion,
    soumettre: async (champs) => {
      await connexion({ email: champs.email.trim(), motDePasse: champs.motDePasse });
      navigate(destination, { replace: true });
    },
  });

  if (utilisateur && !envoi) return <Navigate to={destination} replace />;

  return (
    <div className="container py-5">
      <Helmet>
        <title>Connexion – Trouve ton artisan !</title>
        <meta name="description" content="Connectez-vous à Trouve ton artisan ! pour découvrir les artisans d'Auvergne-Rhône-Alpes et les contacter." />
      </Helmet>

      <section className="auth-section" aria-labelledby="titre-connexion">
        <h1 id="titre-connexion" className="section-title mb-4">Connexion</h1>

        {location.state?.from && (
          <p className="text-center mb-4">Connectez-vous pour accéder aux artisans.</p>
        )}

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
          <div className="mb-4">
            <label htmlFor="motDePasse">Mot de passe</label>
            <input
              id="motDePasse"
              name="motDePasse"
              type="password"
              autoComplete="current-password"
              className="form-control"
              value={form.motDePasse}
              onChange={handleChange}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn-envoyer" disabled={envoi}>
              {envoi ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="text-center mt-4">
          Pas encore de compte ?{' '}
          <Link to="/inscription" state={location.state}>Créer un compte</Link>
        </p>
      </section>
    </div>
  );
}

export default Connexion;
