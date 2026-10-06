import api from './api';

export const subjectService = {
  getAll: () => api.get('/subjects').then((r) => r.data),
  getById: (id) => api.get(`/subjects/${id}`).then((r) => r.data),
};