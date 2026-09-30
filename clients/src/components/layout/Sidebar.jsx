import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, ClipboardList,
  CalendarCheck, DollarSign, CalendarDays, Megaphone, BarChart3,
  Settings, School, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student', 'parent'] },
  { to: '/students', label: 'Étudiants', icon: Users, roles: ['admin', 'teacher'] },
  { to: '/teachers', label: 'Enseignants', icon: GraduationCap, roles: ['admin'] },
  { to: '/classes', label: 'Classes', icon: BookOpen, roles: ['admin', 'teacher'] },
  { to: '/grades', label: 'Notes', icon: ClipboardList, roles: ['admin', 'teacher', 'student', 'parent'] },
  { to: '/attendance', label: 'Présences', icon: CalendarCheck, roles: ['admin', 'teacher', 'student', 'parent'] },
  { to: '/payments', label: 'Paiements', icon: DollarSign, roles: ['admin', 'parent'] },
  { to: '/schedules', label: 'Emploi du temps', icon: CalendarDays, roles: ['admin', 'teacher', 'student', 'parent'] },
  { to: '/announcements', label: 'Annonces', icon: Megaphone, roles: ['admin', 'teacher', 'student', 'parent'] },
  { to: '/reports', label: 'Rapports', icon: BarChart3, roles: ['admin', 'teacher'] },
  { to: '/settings', label: 'Paramètres', icon: Settings, roles: ['admin'] },
];

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const visible = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
        transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-600 rounded-lg"><School size={20} className="text-white" /></div>
            <div>
              <h1 className="font-bold text-lg">SchoolFlow</h1>
              <p className="text-xs text-gray-500">Gestion Scolaire</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden"><X size={20} /></button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {visible.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
              `}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}