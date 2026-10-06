import api from './api';

export const reportService = {
  // Statistiques générales
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),

  // Distribution des notes
  getGradeDistribution: (params) =>
    api.get('/dashboard/grade-distribution', { params }).then((r) => r.data),

  // Statistiques de présences
  getAttendanceStats: (params) =>
    api.get('/dashboard/attendance-chart', { params }).then((r) => r.data),

  // Statistiques de paiements
  getPaymentStats: () => api.get('/payments/stats').then((r) => r.data),

  // Bulletin d'un étudiant
  getStudentReport: (studentId) =>
    api.get(`/students/${studentId}/report`).then((r) => r.data),

  // Notes par classe
  getGradesByClass: (classId, params) =>
    api.get('/grades', { params: { classId, ...params } }).then((r) => r.data),

  // Présences par classe
  getAttendanceByClass: (classId, params) =>
    api.get('/attendances', { params: { classId, ...params } }).then((r) => r.data),
};