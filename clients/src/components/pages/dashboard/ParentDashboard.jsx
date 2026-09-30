import { useEffect, useState } from 'react';
import { Users, DollarSign, CalendarCheck } from 'lucide-react';
import Card from '../../common/Card';
import { useAuth } from '../../../context/AuthContext';
import { studentService } from '../../service/studentService';
import { paymentService } from '../../service/paymetService';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    studentService.getAll().then((res) => setChildren(res.data || [])).catch(() => {});
    paymentService.getAll().then(setPayments).catch(() => {});
  }, []);

  const pending = payments.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {user?.firstName} 👋</h1>
        <p className="text-sm text-gray-500">Votre espace parent</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Mes enfants" value={children.length} icon={<Users size={22} />} color="primary" />
        <Card title="Paiements en attente" value={pending} icon={<DollarSign size={22} />} color="yellow" />
        <Card title="Total paiements" value={payments.length} icon={<CalendarCheck size={22} />} color="green" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Mes enfants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {children.map((c) => (
            <div key={c.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium">{c.user?.firstName} {c.user?.lastName}</h4>
              <p className="text-sm text-gray-500">{c.class?.name || 'Sans classe'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}