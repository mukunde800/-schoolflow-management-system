import api from './api';

export const gradeService = {
  getAll: (params) => api.get('/grades', { params }).then((r) => r.data),
  create: (data) => api.post('/grades', data).then((r) => r.data),
  bulkCreate: (grades) => api.post('/grades/bulk', { grades }).then((r) => r.data),
  update: (id, data) => api.put(`/grades/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/grades/${id}`).then((r) => r.data),
};