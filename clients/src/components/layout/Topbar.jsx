import { Menu, Search, Home } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';
import UserDropdown from './UserDropdown';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const ROUTE_LABELS = {
  '/dashboard': 'Tableau de bord',
  '/students': 'Étudiants',
  '/teachers': 'Enseignants',
  '/classes': 'Classes',
  '/grades': 'Notes',
  '/attendance': 'Présences',
  '/payments': 'Paiements',
  '/schedules': 'Emploi du temps',
  '/announcements': 'Annonces',
  '/reports': 'Rapports',
  '/settings': 'Paramètres',
  '/profile': 'Mon profil',
};

function useBreadcrumb() {
  const location = useLocation();

  return useMemo(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (segments.length === 0) return [{ label: 'Accueil', to: '/dashboard' }];

    const crumbs = [{ label: 'Accueil', to: '/dashboard', icon: Home }];

    let currentPath = '';
    segments.forEach((seg) => {
      currentPath += `/${seg}`;
      const label = ROUTE_LABELS[currentPath] || seg.charAt(0).toUpperCase() + seg.slice(1);
      crumbs.push({ label, to: currentPath });
    });

    return crumbs;
  }, [location.pathname]);
}

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const breadcrumbs = useBreadcrumb();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Raccourci clavier Ctrl+K (préparation future recherche)
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: ouvrir la recherche globale
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between gap-3">
        {/* ==== GAUCHE : Menu mobile + Breadcrumb ==== */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <Menu size={20} />
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm min-w-0">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb.to || idx} className="flex items-center gap-1 min-w-0">
                  {idx > 0 && (
                    <span className="text-gray-400 dark:text-gray-600">/</span>
                  )}
                  {isLast ? (
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors flex items-center gap-1"
                    >
                      {crumb.icon && <crumb.icon size={14} />}
                      {crumb.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden lg:block lg:ml-4 text-xs text-gray-400 dark:text-gray-500">
            {formattedDate}
          </div>
        </div>

        {/* ==== DROITE : Actions ==== */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Bouton recherche (futur) */}
          {/* <button
            onClick={() => alert('Recherche globale — bientôt disponible !')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm text-gray-500 dark:text-gray-400"
            aria-label="Rechercher"
          >
            <Search size={14} />
            <span className="hidden md:inline">Rechercher</span>
            <kbd className="hidden md:inline ml-2 px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-[10px] font-mono">
              Ctrl K
            </kbd>
          </button> */}

          {/* Séparateur */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Thème */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationDropdown />

          {/* Séparateur */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* Utilisateur */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}