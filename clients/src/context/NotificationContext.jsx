import { createContext, useContext, useCallback, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const notify = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), duration);
  }, []);

  const remove = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: 'bg-green-500', error: 'bg-red-500', info: 'bg-blue-500',
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {notifications.map((n) => {
          const Icon = icons[n.type];
          return (
            <div key={n.id} className={`${colors[n.type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in`}>
              <Icon size={18} />
              <span className="text-sm">{n.message}</span>
              <button onClick={() => remove(n.id)} className="ml-2"><X size={14} /></button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);