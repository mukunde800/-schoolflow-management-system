import api from './api';

export const attendanceService = {
  getAll: (params) => api.get('/attendances', { params }).then((r) => r.data),
  getById: (id) => api.get(`/attendances/${id}`).then((r) => r.data),
  create: (data) => api.post('/attendances', data).then((r) => r.data),
  bulkMark: (attendances) =>
    api.post('/attendances/bulk', { attendances }).then((r) => r.data),
  update: (id, data) => api.put(`/attendances/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/attendances/${id}`).then((r) => r.data),
};