import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminNav from '../../components/AdminNav';
import Toast from '../../components/Toast';
import useAdminMessages from '../../hooks/useAdminMessages';

const formatDate = (date) =>
  new Date(date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

function AdminMessages() {
  const [filtre, setFiltre] = useState('tous');
  const { messages, loading, notification, basculerLu, supprimer, fermerNotification } = useAdminMessages(filtre);

  const handleSupprimer = (message) => {
    if (window.confirm(`Supprimer le message de ${message.nom} ?`)) {
      supprimer(message);
    }
  };

  return (
    <div className="container py-5">
      <Helmet>
        <title>Administration – Messages – Trouve ton artisan !</title>
        <meta name="description" content="Espace administrateur : messages de contact reçus." />
      </Helmet>
      <h1 className="section-title mb-4">Administration</h1>
      <AdminNav />

      {notification && (
        <Toast message={notification.message} type={notification.type} onClose={fermerNotification} />
      )}

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <h2 className="h4 mb-0">Messages de contact</h2>
        <div className="btn-group" role="group" aria-label="Filtrer les messages">
          {[['tous', 'Tous'], ['non-lus', 'Non lus']].map(([valeur, libelle]) => (
            <button
              key={valeur}
              type="button"
              className={`btn btn-sm ${filtre === valeur ? 'btn-primary' : 'btn-outline-primary'}`}
              aria-pressed={filtre === valeur}
              onClick={() => setFiltre(valeur)}
            >
              {libelle}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center">Chargement...</p>
      ) : messages.length === 0 ? (
        <p className="text-center text-muted">Aucun message.</p>
      ) : (
        <ul className="list-unstyled admin-messages">
          {messages.map((message) => (
            <li key={message._id} className={`admin-message${message.lu ? '' : ' non-lu'}`}>
              <div className="d-flex flex-wrap justify-content-between gap-2 mb-2">
                <div>
                  <h3 className="h6 mb-1">
                    {!message.lu && <span className="badge bg-primary me-2">Nouveau</span>}
                    {message.objet || 'Sans objet'}
                  </h3>
                  <p className="small text-muted mb-0">
                    De {message.nom} (<a href={`mailto:${message.email}`}>{message.email}</a>) pour{' '}
                    <Link to={`/artisans/${message.artisan.id}`}>{message.artisan.nom}</Link>
                    {' · '}
                    <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
                  </p>
                </div>
                <div className="text-nowrap">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary rounded-pill me-2"
                    onClick={() => basculerLu(message)}
                  >
                    {message.lu ? 'Marquer non lu' : 'Marquer lu'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-supprimer rounded-pill"
                    onClick={() => handleSupprimer(message)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <p className="mb-0 admin-message-texte">{message.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminMessages;
