import api from './api';

export const userService = {
  getProfile: () => api.get('/users/profile').then((r) => r.data),
  updateProfile: (data) => api.put('/users/profile', data).then((r) => r.data),
  changePassword: (data) => api.post('/users/change-password', data).then((r) => r.data),
  getStats: () => api.get('/users/stats').then((r) => r.data),
  deactivate: () => api.delete('/users/deactivate').then((r) => r.data),
};