import { useEffect, useRef, useState } from 'react';
import { Bell, X, Megaphone, DollarSign, CalendarCheck } from 'lucide-react';
import useClickOutside from '../hooks/useClickOutside';
import Badge from '../common/Badge';
import api from '../service/api';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ICONS = {
  announcement: Megaphone,
  payment: DollarSign,
  attendance: CalendarCheck,
  default: Bell,
};

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    api
      .get('/announcements')
      .then(({ data }) => {
        // Transforme les annonces en notifications
        const list = (data || []).slice(0, 10).map((a) => ({
          id: a.id,
          type: 'announcement',
          title: a.title,
          message: a.content?.slice(0, 80) + (a.content?.length > 80 ? '...' : ''),
          date: a.publishedAt,
          priority: a.priority,
          read: false,
        }));
        setNotifications(list);
      })
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 card shadow-xl z-50 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="danger">{unreadCount}</Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Tout marquer comme lu
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-gray-500">
                Chargement...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">Aucune notification</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = ICONS[n.type] || ICONS.default;
                return (
                  <div
                    key={n.id}
                    className={`
                      group relative p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50
                      transition-colors border-b border-gray-50 dark:border-gray-700/50 last:border-0
                      ${!n.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''}
                    `}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`
                          flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
                          ${
                            n.priority === 'high'
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30'
                              : 'bg-primary-100 text-primary-600 dark:bg-primary-900/30'
                          }
                        `}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {n.date
                            ? formatDistanceToNow(new Date(n.date), {
                                addSuffix: true,
                                locale: fr,
                              })
                            : '—'}
                        </p>
                      </div>

                      <button
                        onClick={() => removeNotification(n.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        aria-label="Supprimer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    {!n.read && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-primary-600 rounded-r" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-gray-700 text-center">
              <button
                onClick={() => {
                  setOpen(false);
                  window.location.href = '/announcements';
                }}
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Voir toutes les annonces
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}