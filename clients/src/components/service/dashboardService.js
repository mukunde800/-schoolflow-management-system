import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),
  getActivities: () => api.get('/dashboard/activities').then((r) => r.data),
  getAttendanceChart: () => api.get('/dashboard/attendance-chart').then((r) => r.data),
  getGradeDistribution: () => api.get('/dashboard/grade-distribution').then((r) => r.data),
};