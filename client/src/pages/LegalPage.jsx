import { Helmet } from 'react-helmet-async';

function LegalPage({ title }) {
  return (
    <div className="container py-5">
      <Helmet>
        <title>{title} – Trouve ton artisan !</title>
        <meta name="description" content={`${title} de Trouve ton artisan !, plateforme de mise en relation avec des artisans en Auvergne-Rhône-Alpes.`} />
      </Helmet>
      <h1 className="section-title mb-4">{title}</h1>
      <p>Cette page est en construction.</p>
    </div>
  );
}

export default LegalPage;
