import { Link, useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import AdminNav from '../../components/AdminNav';
import useArtisanForm from '../../hooks/useArtisanForm';
import NotFound from '../NotFound';

// Regroupe les spécialités par catégorie pour les <optgroup> du select
const parCategorie = (specialites) =>
  specialites.reduce((groupes, specialite) => {
    const categorie = specialite.Categorie?.nom || 'Autres';
    return { ...groupes, [categorie]: [...(groupes[categorie] || []), specialite] };
  }, {});

function Champ({ id, label, obligatoire, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={id}>
        {label}
        {obligatoire && <span aria-hidden="true"> *</span>}
      </label>
      {children}
    </div>
  );
}

function AdminArtisanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, specialites, chargement, introuvable, erreur, envoi, handleChange, handleSubmit } =
    useArtisanForm(id, { onSucces: () => navigate('/admin') });

  if (introuvable) return <NotFound />;
  if (chargement) return <div className="container py-5 text-center">Chargement...</div>;

  const titre = id ? `Modifier ${form.nom}` : 'Ajouter un artisan';
  const champTexte = (name, autres = {}) => ({
    id: name,
    name,
    className: 'form-control',
    value: form[name],
    onChange: handleChange,
    ...autres,
  });

  return (
    <div className="container py-5">
      <Helmet>
        <title>{titre} – Administration – Trouve ton artisan !</title>
        <meta name="description" content="Espace administrateur : fiche artisan." />
      </Helmet>
      <h1 className="section-title mb-4">Administration</h1>
      <AdminNav />
      <h2 className="h4 mb-3">{titre}</h2>
      <p className="text-muted">Les champs marqués d'un * sont obligatoires.</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {erreur && <p className="auth-erreur" role="alert">{erreur}</p>}

        <div className="row">
          <div className="col-md-6">
            <Champ id="nom" label="Nom" obligatoire>
              <input type="text" required {...champTexte('nom')} />
            </Champ>
            <Champ id="specialiteId" label="Spécialité" obligatoire>
              <select {...champTexte('specialiteId', { className: 'form-select' })} required>
                <option value="">Choisir une spécialité</option>
                {Object.entries(parCategorie(specialites)).map(([categorie, liste]) => (
                  <optgroup key={categorie} label={categorie}>
                    {liste.map((specialite) => (
                      <option key={specialite.id} value={specialite.id}>{specialite.nom}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Champ>
            <Champ id="email" label="Email de contact" obligatoire>
              <input type="email" autoComplete="off" required {...champTexte('email')} />
            </Champ>
            <Champ id="telephone" label="Téléphone">
              <input type="tel" {...champTexte('telephone')} />
            </Champ>
            <Champ id="image" label="Image (URL https ou /images/...)">
              <input type="text" {...champTexte('image')} />
            </Champ>
          </div>
          <div className="col-md-6">
            <Champ id="adresse" label="Adresse">
              <input type="text" {...champTexte('adresse')} />
            </Champ>
            <div className="row">
              <div className="col-5">
                <Champ id="codePostal" label="Code postal">
                  <input type="text" inputMode="numeric" {...champTexte('codePostal')} />
                </Champ>
              </div>
              <div className="col-7">
                <Champ id="ville" label="Ville" obligatoire>
                  <input type="text" required {...champTexte('ville')} />
                </Champ>
              </div>
            </div>
            <Champ id="description" label="Description">
              <textarea rows={5} style={{ resize: 'vertical' }} {...champTexte('description')} />
            </Champ>
            <div className="form-check mb-3">
              <input
                id="artisanDuMois"
                name="artisanDuMois"
                type="checkbox"
                className="form-check-input"
                checked={form.artisanDuMois}
                onChange={handleChange}
              />
              <label htmlFor="artisanDuMois" className="form-check-label">
                Artisan du mois (3 maximum)
              </label>
            </div>
          </div>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
          <button type="submit" className="btn-envoyer" disabled={envoi}>
            {envoi ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <Link to="/admin" className="btn-annuler">Annuler</Link>
        </div>
      </form>
    </div>
  );
}

export default AdminArtisanForm;
