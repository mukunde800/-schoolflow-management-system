import { useEffect, useState } from 'react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import api from '../../service/api';
import { formatDate } from '../../../utils/formatters';

export default function AttendancePage() {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attendances').then(({ data }) => setAttendances(data)).finally(() => setLoading(false));
  }, []);

  const statusVariant = { present: 'success', absent: 'danger', late: 'warning', excused: 'info' };

  const columns = [
    { key: 'student', label: 'Étudiant', render: (r) => `${r.student?.user?.firstName} ${r.student?.user?.lastName}` },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Statut', render: (r) => <Badge variant={statusVariant[r.status]}>{r.status}</Badge> },
    { key: 'justification', label: 'Justification', render: (r) => r.justification || '—' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Présences</h1>
      <Table columns={columns} data={attendances} loading={loading} />
    </div>
  );
}