import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArtisan, sendContact } from '../services/api';

function DetailArtisan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [form, setForm] = useState({ nom: '', email: '', objet: '', message: '' });
  const [statut, setStatut] = useState(null);

  useEffect(() => {
    getArtisan(id).then((data) => {
      setArtisan(data);
      document.title = `${data.nom} – Trouve ton artisan !`;
    }).catch(() => navigate('/404', { replace: true }));
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.nom.trim() || !form.email.trim() || !form.message.trim()) {
      setStatut('validation');
      return;
    }
    if (!emailRegex.test(form.email)) {
      setStatut('emailInvalid');
      return;
    }

    try {
      await sendContact(id, form);
      setStatut('success');
      setForm({ nom: '', email: '', objet: '', message: '' });
    } catch {
      setStatut('error');
    }
  };

  if (!artisan) return <div className="container py-5 text-center">Chargement...</div>;

  return (
    <div className="container py-5">
      {/* Layout desktop/tablette : 2 colonnes */}
      <div className="row g-5 d-none d-md-flex mb-5">
        <div className="col-md-4 text-center">
          {artisan.image ? (
            <img
              src={artisan.image}
              alt={artisan.nom}
              className="img-fluid rounded-4 mb-3"
              style={{ maxHeight: 340, objectFit: 'cover', width: '100%' }}
            />
          ) : (
            <div
              className="rounded-4 mb-3 d-flex align-items-center justify-content-center bg-secondary"
              style={{ height: 280 }}
              aria-hidden="true"
            >
              <span style={{ fontSize: '4rem' }}>🔨</span>
            </div>
          )}
          <p className="mb-1" style={{ color: '#f5a623' }}>
            ⭐⭐⭐⭐⭐ <span className="text-muted">(5/5)</span>
          </p>
          {artisan.Specialite && (
            <p className="mb-1">{artisan.Specialite.nom}</p>
          )}
          <p className="mb-0">📍 {artisan.ville}</p>
        </div>

        <div className="col-md-8">
          <h1 style={{ color: '#0074c7', fontWeight: 700 }}>
            À propos de {artisan.nom}
          </h1>
          <p className="mt-3">{artisan.description}</p>
          <p className="text-muted">
            Si vous souhaitez faire appel à ce professionnel, vous pouvez le
            contacter ci-dessous !
          </p>
        </div>
      </div>

      {/* Layout mobile : empilé */}
      <div className="d-md-none text-center mb-4">
        <h1 style={{ color: '#0074c7', fontWeight: 700 }} className="mb-3">
          {artisan.nom}
        </h1>
        {artisan.image ? (
          <img
            src={artisan.image}
            alt={artisan.nom}
            className="img-fluid rounded-4 mb-3"
            style={{ width: '100%', maxHeight: 320, objectFit: 'cover' }}
          />
        ) : (
          <div
            className="rounded-4 mb-3 d-flex align-items-center justify-content-center bg-secondary mx-auto"
            style={{ height: 220, maxWidth: 340 }}
            aria-hidden="true"
          >
            <span style={{ fontSize: '4rem' }}>🔨</span>
          </div>
        )}
        <p className="mb-1" style={{ color: '#f5a623' }}>
          ⭐⭐⭐⭐⭐ <span className="text-muted">(5/5)</span>
        </p>
        {artisan.Specialite && <p className="mb-1">{artisan.Specialite.nom}</p>}
        <p className="mb-0">📍 {artisan.ville}</p>
      </div>

      <div className="d-md-none mb-4">
        <h2 style={{ color: '#0074c7', fontWeight: 700, textAlign: 'center' }}>
          À propos de {artisan.nom}
        </h2>
        <p className="mt-3">{artisan.description}</p>
        <p className="text-muted">
          Si vous souhaitez faire appel à ce professionnel, vous pouvez le
          contacter ci-dessous !
        </p>
      </div>

      {/* Formulaire de contact */}
      <section aria-labelledby="form-contact-title">
        <h2 id="form-contact-title" className="visually-hidden">
          Contacter {artisan.nom}
        </h2>

        {statut === 'success' && (
          <div className="alert alert-success" role="alert">
            Votre message a bien été envoyé. Une réponse vous sera apportée sous 48h.
          </div>
        )}
        {statut === 'validation' && (
          <div className="alert alert-warning" role="alert">
            Veuillez remplir les champs nom, email et message.
          </div>
        )}
        {statut === 'emailInvalid' && (
          <div className="alert alert-warning" role="alert">
            L'adresse email saisie n'est pas valide.
          </div>
        )}
        {statut === 'error' && (
          <div className="alert alert-danger" role="alert">
            Une erreur est survenue. Veuillez réessayer.
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form-section">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="nom">Nom</label>
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  className="form-control"
                  value={form.nom}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="objet">Objet</label>
                <input
                  id="objet"
                  name="objet"
                  type="text"
                  className="form-control"
                  value={form.objet}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-none d-md-block">
                <button type="submit" className="btn-envoyer">
                  Envoyer
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3 h-100">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-control"
                  rows={8}
                  style={{ resize: 'none', height: 'calc(100% - 28px)' }}
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-12 d-md-none text-center">
              <button type="submit" className="btn-envoyer">
                Envoyer
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

export default DetailArtisan;
