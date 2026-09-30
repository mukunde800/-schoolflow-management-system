import api from './api';

export const teacherService = {
  getAll: (params) => api.get('/teachers', { params }).then((r) => r.data),
  getById: (id) => api.get(`/teachers/${id}`).then((r) => r.data),
  create: (data) => api.post('/teachers', data).then((r) => r.data),
  update: (id, data) => api.put(`/teachers/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/teachers/${id}`).then((r) => r.data),
};