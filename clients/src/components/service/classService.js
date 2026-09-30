import api from './api';

export const classService = {
  getAll: () => api.get('/classes').then((r) => r.data),
  getById: (id) => api.get(`/classes/${id}`).then((r) => r.data),
  create: (data) => api.post('/classes', data).then((r) => r.data),
  update: (id, data) => api.put(`/classes/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/classes/${id}`).then((r) => r.data),
};