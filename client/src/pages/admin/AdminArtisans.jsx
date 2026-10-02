import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminNav from '../../components/AdminNav';
import Toast from '../../components/Toast';
import useAdminArtisans from '../../hooks/useAdminArtisans';

function AdminArtisans() {
  const { artisans, loading, notification, supprimer, basculerDuMois, fermerNotification } = useAdminArtisans();
  const nbDuMois = artisans.filter((artisan) => artisan.artisanDuMois).length;

  const handleSupprimer = (artisan) => {
    if (window.confirm(`Supprimer définitivement ${artisan.nom} ?`)) {
      supprimer(artisan);
    }
  };

  return (
    <div className="container py-5">
      <Helmet>
        <title>Administration – Artisans – Trouve ton artisan !</title>
        <meta name="description" content="Espace administrateur : gestion des artisans." />
      </Helmet>
      <h1 className="section-title mb-4">Administration</h1>
      <AdminNav />

      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={fermerNotification} />
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h4 mb-0">
          Artisans <span className="text-muted fs-6">({artisans.length} · {nbDuMois}/3 du mois)</span>
        </h2>
        <Link to="/admin/artisans/nouveau" className="btn btn-primary rounded-pill px-4 fw-bold">
          Ajouter un artisan
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle admin-table">
            <caption className="visually-hidden">Liste des artisans</caption>
            <thead>
              <tr>
                <th scope="col">Nom</th>
                <th scope="col">Spécialité</th>
                <th scope="col">Ville</th>
                <th scope="col" className="text-center">Du mois</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artisans.map((artisan) => (
                <tr key={artisan.id}>
                  <td>
                    <Link to={`/artisans/${artisan.id}`}>{artisan.nom}</Link>
                  </td>
                  <td>{artisan.Specialite?.nom}</td>
                  <td>{artisan.ville}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={artisan.artisanDuMois}
                      onChange={() => basculerDuMois(artisan)}
                      aria-label={`${artisan.nom} artisan du mois`}
                    />
                  </td>
                  <td className="text-end text-nowrap">
                    <Link
                      to={`/admin/artisans/${artisan.id}`}
                      className="btn btn-sm btn-outline-primary rounded-pill me-2"
                      aria-label={`Modifier ${artisan.nom}`}
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      className="btn btn-sm btn-supprimer rounded-pill"
                      onClick={() => handleSupprimer(artisan)}
                      aria-label={`Supprimer ${artisan.nom}`}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminArtisans;
