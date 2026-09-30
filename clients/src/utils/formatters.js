import { format } from 'date-fns';

export const formatDate = (date, pattern = 'dd/MM/yyyy') => {
  if (!date) return '—';
  try { return format(new Date(date), pattern); }
  catch { return '—'; }
};

export const formatCurrency = (amount, currency = 'EUR') => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
};

export const formatName = (user) => {
  if (!user) return '—';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};