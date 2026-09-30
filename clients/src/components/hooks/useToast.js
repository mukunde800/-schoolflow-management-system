import { useNotification } from '../../context/NotificationContext';

export default function useToast() {
  const { notify } = useNotification();
  return {
    success: (msg) => notify(msg, 'success'),
    error: (msg) => notify(msg, 'error'),
    info: (msg) => notify(msg, 'info'),
  };
}