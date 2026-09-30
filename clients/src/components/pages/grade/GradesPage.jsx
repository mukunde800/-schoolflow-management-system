import { useEffect, useState } from 'react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { gradeService } from '../../service/gradeService';
import { formatDate } from '../../../utils/formatters';
import { Plus } from 'lucide-react';

export default function GradesPage() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gradeService.getAll().then(setGrades).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'student', label: 'Étudiant', render: (r) => `${r.student?.user?.firstName} ${r.student?.user?.lastName}` },
    { key: 'subject', label: 'Matière', render: (r) => r.subject?.name },
    { key: 'value', label: 'Note', render: (r) => <strong>{r.value}/20</strong> },
    { key: 'coefficient', label: 'Coef.' },
    { key: 'type', label: 'Type', render: (r) => <Badge variant="info">{r.type}</Badge> },
    { key: 'date', label: 'Date', render: (r) => formatDate(r.date) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button icon={<Plus size={16} />}>Ajouter une note</Button>
      </div>
      <Table columns={columns} data={grades} loading={loading} />
    </div>
  );
}