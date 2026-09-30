import { useEffect, useState } from 'react';
import Table from '../../common/Table';
import SearchBar from '../../common/SearchBar';
import Button from '../../common/Button';
import { teacherService } from '../../service/teacherService';
import useDebounce from '../../hooks/useDebounce';
import { Plus } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';

export default function TeachersListPage() {
  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search);

  useEffect(() => {
    setLoading(true);
    teacherService.getAll({ search: debounced })
      .then(setData).finally(() => setLoading(false));
  }, [debounced]);

  const columns = [
    { key: 'employeeId', label: 'Matricule' },
    { key: 'name', label: 'Nom complet', render: (r) => `${r.user?.firstName} ${r.user?.lastName}` },
    { key: 'email', label: 'Email', render: (r) => r.user?.email },
    { key: 'specialization', label: 'Spécialité' },
    { key: 'hireDate', label: "Date d'embauche", render: (r) => formatDate(r.hireDate) },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Enseignants</h1>
        <Button icon={<Plus size={16} />}>Nouvel enseignant</Button>
      </div>
      <div className="max-w-md"><SearchBar value={search} onChange={setSearch} /></div>
      <Table columns={columns} data={data.data} loading={loading} />
    </div>
  );
}