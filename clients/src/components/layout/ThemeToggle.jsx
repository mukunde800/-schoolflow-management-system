import { useRef, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import useClickOutside from '../hooks/useClickOutside';
import { useTheme } from '../../context/ThemeContext';

const OPTIONS = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
  { value: 'system', label: 'Système', icon: Monitor },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, () => setOpen(false));

  const current = OPTIONS.find((o) => o.value === theme) || OPTIONS[0];
  const CurrentIcon = current.icon;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Changer le thème"
      >
        <CurrentIcon size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 card shadow-xl z-50 py-1 animate-fade-in">
          {OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
                ${
                  theme === value
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 font-medium'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <Icon size={16} />
              {label}
              {theme === value && <span className="ml-auto text-primary-600">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}