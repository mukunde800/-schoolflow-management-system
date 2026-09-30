import api from './api';

export const paymentService = {
  getAll: (params) => api.get('/payments', { params }).then((r) => r.data),
  getStats: () => api.get('/payments/stats').then((r) => r.data),
  create: (data) => api.post('/payments', data).then((r) => r.data),
  update: (id, data) => api.put(`/payments/${id}`, data).then((r) => r.data),
  markAsPaid: (id) => api.patch(`/payments/${id}/pay`).then((r) => r.data),
  remove: (id) => api.delete(`/payments/${id}`).then((r) => r.data),
};