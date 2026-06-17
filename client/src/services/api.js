import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getCategories = () =>
  api.get('/categories').then((r) => r.data);

export const getArtisans = (params) =>
  api.get('/artisans', { params }).then((r) => r.data);

export const getArtisansDuMois = () =>
  api.get('/artisans/du-mois').then((r) => r.data);

export const getArtisan = (id) =>
  api.get(`/artisans/${id}`).then((r) => r.data);

export const sendContact = (id, data) =>
  api.post(`/artisans/${id}/contact`, data).then((r) => r.data);
