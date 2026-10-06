import api from './api';

export const settingService = {
  getAll: () => api.get('/settings').then((r) => r.data),
  save: (data) => api.post('/settings', data).then((r) => r.data),
  reset: () => api.delete('/settings').then((r) => r.data),
};