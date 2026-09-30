import api from './api';

export const studentService = {
  getAll: (params) => api.get('/students', { params }).then((r) => r.data),
  getById: (id) => api.get(`/students/${id}`).then((r) => r.data),
  create: (data) => api.post('/students', data).then((r) => r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/students/${id}`).then((r) => r.data),
  getGrades: (id) => api.get(`/students/${id}/grades`).then((r) => r.data),
  getAttendance: (id) => api.get(`/students/${id}/attendance`).then((r) => r.data),
};