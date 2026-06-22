import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <Helmet>
        <title>Page non trouvée – Trouve ton artisan !</title>
        <meta name="description" content="Cette page n'existe pas sur Trouve ton artisan !." />
      </Helmet>
      <h1 className="section-title mb-4">Page non trouvée...</h1>
      <p style={{ fontSize: '5rem', lineHeight: 1 }} aria-hidden="true">🤔</p>
      <p className="section-title mt-4 mb-5" style={{ fontSize: '1.2rem' }}>
        Il semble que la page que vous essayez d'atteindre n'existe pas
      </p>
      <Link
        to="/"
        className="btn btn-primary rounded-pill px-5 py-3 fw-bold"
        style={{ fontSize: '1.1rem' }}
      >
        Accueil
      </Link>
    </div>
  );
}

export default NotFound;
