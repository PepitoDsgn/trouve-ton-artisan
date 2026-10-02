import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  // Envoie le cookie de session (httpOnly) avec chaque requête
  withCredentials: true,
});

// Message d'erreur renvoyé par l'API, ou message par défaut
export const messageErreur = (error, parDefaut = 'Une erreur est survenue. Veuillez réessayer.') =>
  error.response?.data?.message || parDefaut;

// Appelle callback quand l'API répond 401 hors routes d'authentification
// (session expirée). Retourne la fonction de désinscription.
export const surSessionExpiree = (callback) => {
  const id = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !error.config.url.startsWith('/auth/')) {
        callback();
      }
      return Promise.reject(error);
    }
  );
  return () => api.interceptors.response.eject(id);
};

export const getCategories = () =>
  api.get('/categories').then((response) => response.data);

export const getArtisans = (params) =>
  api.get('/artisans', { params }).then((response) => response.data);

export const getArtisansDuMois = () =>
  api.get('/artisans/du-mois').then((response) => response.data);

export const getArtisan = (id) =>
  api.get(`/artisans/${id}`).then((response) => response.data);

export const sendContact = (id, data) =>
  api.post(`/artisans/${id}/contact`, data).then((response) => response.data);

export const inscription = (data) =>
  api.post('/auth/inscription', data).then((response) => response.data.utilisateur);

export const connexion = (data) =>
  api.post('/auth/connexion', data).then((response) => response.data.utilisateur);

export const deconnexion = () => api.post('/auth/deconnexion');

export const getMoi = () =>
  api.get('/auth/moi').then((response) => response.data.utilisateur);

export const getFavoris = () =>
  api.get('/favoris').then((response) => response.data);

export const ajouterFavori = (artisanId) => api.put(`/favoris/${artisanId}`);

export const retirerFavori = (artisanId) => api.delete(`/favoris/${artisanId}`);

// Espace admin
export const adminGetSpecialites = () =>
  api.get('/admin/specialites').then((response) => response.data);

export const adminGetArtisan = (id) =>
  api.get(`/admin/artisans/${id}`).then((response) => response.data);

export const adminCreerArtisan = (data) =>
  api.post('/admin/artisans', data).then((response) => response.data);

export const adminModifierArtisan = (id, data) =>
  api.put(`/admin/artisans/${id}`, data).then((response) => response.data);

export const adminSupprimerArtisan = (id) => api.delete(`/admin/artisans/${id}`);

export const adminGetMessages = (params) =>
  api.get('/admin/messages', { params }).then((response) => response.data);

export const adminMarquerMessage = (id, lu) =>
  api.patch(`/admin/messages/${id}`, { lu }).then((response) => response.data);

export const adminSupprimerMessage = (id) => api.delete(`/admin/messages/${id}`);
