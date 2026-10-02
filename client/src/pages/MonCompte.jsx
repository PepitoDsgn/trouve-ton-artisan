import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useAuth from '../hooks/useAuth';
import useMonCompte from '../hooks/useMonCompte';

function MonCompte() {
  const { utilisateur } = useAuth();
  const {
    motDePasse,
    setMotDePasse,
    erreur,
    envoi,
    erreurExport,
    telechargerDonnees,
    handleSupprimer,
  } = useMonCompte();
  const estAdmin = utilisateur.role === 'admin';

  return (
    <div className="container py-5">
      <Helmet>
        <title>Mon compte – Trouve ton artisan !</title>
        <meta name="description" content="Gérez votre compte Trouve ton artisan ! : vos données personnelles et la suppression de votre compte." />
      </Helmet>
      <h1 className="section-title mb-5">Mon compte</h1>

      <div className="compte-sections">
        <section className="compte-section" aria-labelledby="titre-infos">
          <h2 id="titre-infos" className="h5">Mes informations</h2>
          <p className="mb-0">
            Email : <strong>{utilisateur.email}</strong>
          </p>
        </section>

        <section className="compte-section" aria-labelledby="titre-donnees">
          <h2 id="titre-donnees" className="h5">Mes données</h2>
          <p>
            Téléchargez toutes les données liées à votre compte (compte, favoris, messages
            envoyés) dans un fichier JSON.{' '}
            <Link to="/donnees-personnelles">En savoir plus sur vos données</Link>
          </p>
          {erreurExport && <p className="texte-erreur" role="alert">{erreurExport}</p>}
          <button type="button" className="btn btn-primary rounded-pill px-4 fw-bold" onClick={telechargerDonnees}>
            Télécharger mes données
          </button>
        </section>

        <section className="compte-section compte-danger" aria-labelledby="titre-suppression">
          <h2 id="titre-suppression" className="h5">Supprimer mon compte</h2>
          {estAdmin ? (
            <p className="mb-0">
              Le compte administrateur ne peut pas être supprimé depuis le site.
            </p>
          ) : (
            <form onSubmit={handleSupprimer} noValidate>
              <p>
                Votre compte, vos favoris et les messages que vous avez envoyés seront
                supprimés définitivement.
              </p>
              {erreur && <p className="texte-erreur" role="alert">{erreur}</p>}
              <div className="mb-3" style={{ maxWidth: 360 }}>
                <label htmlFor="motDePasseSuppression" className="form-label">
                  Mot de passe (confirmation)
                </label>
                <input
                  id="motDePasseSuppression"
                  type="password"
                  autoComplete="current-password"
                  className="form-control"
                  value={motDePasse}
                  onChange={(event) => setMotDePasse(event.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-supprimer rounded-pill px-4 fw-bold" disabled={envoi}>
                {envoi ? 'Suppression...' : 'Supprimer mon compte'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

export default MonCompte;
