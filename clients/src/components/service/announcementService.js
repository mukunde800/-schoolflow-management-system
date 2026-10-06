import api from './api';

export const announcementService = {
  getAll: (params) => api.get('/announcements', { params }).then((r) => r.data),
  getById: (id) => api.get(`/announcements/${id}`).then((r) => r.data),
  create: (data) => api.post('/announcements', data).then((r) => r.data),
  update: (id, data) => api.put(`/announcements/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/announcements/${id}`).then((r) => r.data),
};