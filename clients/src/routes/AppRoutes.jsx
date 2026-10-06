import { Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import AuthLayout from '../components/layout/AuthLayout';

import LoginPage from '../components/pages/auth/LoginPage';
import RegisterPage from '../components/pages/auth/RegisterPage';

import AdminDashboard from '../components/pages/dashboard/AdminDashboard';
import TeacherDashboard from '../components/pages/dashboard/TeacherDashboard';
import StudentDashboard from '../components/pages/dashboard/StudentDashboard';
import ParentDashboard from '../components/pages/dashboard/ParentDashboard';

import StudentsListPage from '../components/pages/students/StudentsListPage';
import StudentDetailPage from '../components/pages/students/StudentDetailPage';
import StudentCreatePage from '../components/pages/students/StudentCreatePage';

import TeachersListPage from '../components/pages/teacher/TeachersListPage';
import ClassesListPage from '../components/pages/class/ClassesListPage';
import GradesPage from '../components/pages/grade/GradesPage';
import AttendancePage from '../components/pages/attendance/AttendancePage';
import PaymentsPage from '../components/pages/payment/PaymentsPage';
import SchedulesPage from '../components/pages/schulde/SchedulesPage';
import AnnouncementsPage from '../components/pages/announcements/AnnouncementsPage';
import ReportsPage from '../components/pages/rapports/RapportsPage';
import SettingsPage from '../components/pages/settings/SettingsPage';
import ProfilePage from '../components/pages/profile/ProfilePage';
import NotFoundPage from '../components/pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/parent" element={<ParentDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />

          <Route path="/students" element={<StudentsListPage />} />
          <Route path="/students/new" element={<StudentCreatePage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />

          <Route path="/teachers" element={<TeachersListPage />} />
          <Route path="/classes" element={<ClassesListPage />} />
          <Route path="/grades" element={<GradesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}