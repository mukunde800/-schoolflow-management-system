import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import SearchBar from '../../common/SearchBar';
import Pagination from '../../common/Pagination';
import Badge from '../../common/Badge';
import ConfirmDialog from '../../common/ConfirmDialog';
import { studentService } from '../../service/studentService';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';

export default function StudentsListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [data, setData] = useState({ data: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const debounced = useDebounce(search);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await studentService.getAll({ page, limit: 10, search: debounced });
      setData(res);
    } catch { toast.error('Erreur de chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [page, debounced]);

  const handleDelete = async () => {
    try {
      await studentService.remove(confirmId);
      toast.success('Étudiant supprimé');
      setConfirmId(null);
      fetchData();
    } catch { toast.error('Erreur'); }
  };

  const columns = [
    { key: 'matricule', label: 'Matricule' },
    { key: 'name', label: 'Nom complet', render: (r) => `${r.user?.firstName || ''} ${r.user?.lastName || ''}` },
    { key: 'email', label: 'Email', render: (r) => r.user?.email },
    { key: 'class', label: 'Classe', render: (r) => r.class?.name || '—' },
    { key: 'status', label: 'Statut', render: (r) => (
      <Badge variant={r.status === 'active' ? 'success' : 'default'}>{r.status}</Badge>
    )},
    { key: 'enrollmentDate', label: 'Inscrit le', render: (r) => formatDate(r.enrollmentDate) },
    { key: 'actions', label: 'Actions', render: (r) => (
      <div className="flex gap-2">
        <button onClick={(e) => { e.stopPropagation(); navigate(`/students/${r.id}`); }} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Eye size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); navigate(`/students/${r.id}?edit=1`); }} className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Pencil size={16} /></button>
        <button onClick={(e) => { e.stopPropagation(); setConfirmId(r.id); }} className="p-1.5 rounded hover:bg-red-100 text-red-500"><Trash2 size={16} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Étudiants</h1>
          <p className="text-sm text-gray-500">{data.total} étudiants</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => navigate('/students/new')}>Nouvel étudiant</Button>
      </div>

      <div className="max-w-md"><SearchBar value={search} onChange={setSearch} placeholder="Rechercher..." /></div>

      <Table columns={columns} data={data.data} loading={loading} onRowClick={(r) => navigate(`/students/${r.id}`)} />
      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />

      <ConfirmDialog
        isOpen={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        title="Supprimer" message="Voulez-vous vraiment supprimer cet étudiant ?"
      />
    </div>
  );
}