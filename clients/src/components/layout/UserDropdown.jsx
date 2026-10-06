import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown, Shield, HelpCircle } from 'lucide-react';
import useClickOutside from '../hooks/useClickOutside';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import useToast from '../hooks/useToast';

const ROLE_COLORS = {
  admin: 'danger',
  teacher: 'info',
  student: 'success',
  parent: 'warning',
};

const ROLE_LABELS = {
  admin: 'Administrateur',
  teacher: 'Enseignant',
  student: 'Étudiant',
  parent: 'Parent',
};

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const handleLogout = () => {
    toast.success('Déconnexion réussie');
    setTimeout(() => logout(), 300);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Menu utilisateur"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-semibold text-sm shadow-sm">
          {user?.firstName?.[0]?.toUpperCase()}
          {user?.lastName?.[0]?.toUpperCase()}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium leading-tight">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {ROLE_LABELS[user?.role] || user?.role}
          </p>
        </div>
        <ChevronDown
          size={14}
          className={`hidden md:block text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 card shadow-xl z-50 animate-fade-in overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow-md">
                {user?.firstName?.[0]?.toUpperCase()}
                {user?.lastName?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant={ROLE_COLORS[user?.role] || 'info'}>
                <Shield size={10} className="inline mr-1" />
                {ROLE_LABELS[user?.role] || user?.role}
              </Badge>
            </div>
          </div>

          {/* Menu */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <User size={16} className="text-gray-400" />
              Mon profil
            </Link>

            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Settings size={16} className="text-gray-400" />
              Paramètres
            </Link>

            {/* <button
              onClick={() => {
                setOpen(false);
                toast.info('Centre d\'aide bientôt disponible');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <HelpCircle size={16} className="text-gray-400" />
              Aide & Support
            </button> */}
          </div>

          {/* Separator + Logout */}
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-medium"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}