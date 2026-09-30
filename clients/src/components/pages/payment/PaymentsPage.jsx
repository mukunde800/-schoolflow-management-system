import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import Card from '../../common/Card';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common//Button';
import { paymentService } from '../../service/paymetService';
import { formatDate, formatCurrency } from '../../../utils/formatters';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([paymentService.getAll(), paymentService.getStats()])
      .then(([p, s]) => { setPayments(p); setStats(s); })
      .finally(() => setLoading(false));
  }, []);

  const statusVariant = { paid: 'success', pending: 'warning', overdue: 'danger', cancelled: 'default' };

  const columns = [
    { key: 'student', label: 'Étudiant', render: (r) => `${r.student?.user?.firstName} ${r.student?.user?.lastName}` },
    { key: 'amount', label: 'Montant', render: (r) => formatCurrency(r.amount) },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Statut', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { key: 'dueDate', label: 'Échéance', render: (r) => formatDate(r.dueDate) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <Button icon={<Plus size={16} />}>Nouveau paiement</Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Encaissé" value={formatCurrency(stats.total || 0)} color="green" />
          <Card title="En attente" value={formatCurrency(stats.pending || 0)} color="yellow" />
          <Card title="En retard" value={formatCurrency(stats.overdue || 0)} color="red" />
        </div>
      )}

      <Table columns={columns} data={payments} loading={loading} />
    </div>
  );
}