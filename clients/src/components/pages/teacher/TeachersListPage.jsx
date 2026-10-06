import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Table from '../../common/Table';
import SearchBar from '../../common/SearchBar';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Badge from '../../common/Badge';
import Pagination from '../../common/Pagination';
import ConfirmDialog from '../../common/ConfirmDialog';
import { teacherService } from '../../service/teacherService';
import useDebounce from '../../hooks/useDebounce';
import useToast from '../../hooks/useToast';
import { formatDate } from '../../../utils/formatters';

const EMPTY_FORM = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  employeeId: '',
  hireDate: '',
  specialization: '',
  diploma: '',
  salary: '',
};

const DIPLOMAS = [
  { value: '', label: '— Sélectionner —' },
  { value: 'Licence', label: 'Licence' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorat', label: 'Doctorat' },
  { value: 'Bac+5', label: 'Bac+5' },
];

export default function TeachersListPage() {
  const toast = useToast();

  const [data, setData] = useState({ data: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search);

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ============ FETCH ============
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await teacherService.getAll({ page, limit: 10, search: debounced });
      setData({
        data: Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [],
        total: res.total || 0,
        totalPages: res.totalPages || 1,
      });
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
      setData({ data: [], total: 0, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debounced]);

  // ============ OPEN FORMS ============
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (teacher) => {
    setForm({
      email: teacher.user?.email || '',
      password: '',
      firstName: teacher.user?.firstName || '',
      lastName: teacher.user?.lastName || '',
      phone: teacher.user?.phone || '',
      employeeId: teacher.employeeId || '',
      hireDate: teacher.hireDate?.slice(0, 10) || '',
      specialization: teacher.specialization || '',
      diploma: teacher.diploma || '',
      salary: teacher.salary || '',
    });
    setErrors({});
    setEditingId(teacher.id);
    setIsFormOpen(true);
  };

  const openDetail = async (teacher) => {
    try {
      const detail = await teacherService.getById(teacher.id);
      setSelectedTeacher(detail);
      setIsDetailOpen(true);
    } catch {
      toast.error('Erreur de chargement');
    }
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName?.trim()) e.lastName = 'Nom requis';
    if (!form.email?.trim()) e.email = 'Email requis';
    if (!editingId && !form.password) e.password = 'Mot de passe requis';
    if (form.password && form.password.length < 6) e.password = 'Minimum 6 caractères';
    if (!form.employeeId?.trim()) e.employeeId = 'Matricule requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============ SUBMIT ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = { ...form };
      if (editingId && !payload.password) delete payload.password;
      if (payload.salary) payload.salary = parseFloat(payload.salary);
      else delete payload.salary;

      if (editingId) {
        await teacherService.update(editingId, payload);
        toast.success('Enseignant mis à jour');
      } else {
        await teacherService.create(payload);
        toast.success('Enseignant créé');
      }

      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ============ DELETE ============
  const handleDelete = async () => {
    try {
      await teacherService.remove(deleteId);
      toast.success('Enseignant supprimé');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ============ COLUMNS ============
  const columns = [
    { key: 'employeeId', label: 'Matricule' },
    {
      key: 'name',
      label: 'Nom complet',
      render: (r) => `${r.user?.firstName || ''} ${r.user?.lastName || ''}`.trim() || '—',
    },
    { key: 'email', label: 'Email', render: (r) => r.user?.email || '—' },
    {
      key: 'specialization',
      label: 'Spécialité',
      render: (r) => r.specialization || '—',
    },
    {
      key: 'diploma',
      label: 'Diplôme',
      render: (r) => r.diploma ? <Badge variant="info">{r.diploma}</Badge> : '—',
    },
    {
      key: 'hireDate',
      label: "Date d'embauche",
      render: (r) => formatDate(r.hireDate),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openDetail(r); }}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Voir"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(r); }}
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Modifier"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(r.id);
              setIsConfirmOpen(true);
            }}
            className="p-1.5 rounded hover:bg-red-100 text-red-500"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // ============ RENDER ============
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Enseignants</h1>
          <p className="text-sm text-gray-500">{data.total} enseignants</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Nouvel enseignant
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un enseignant..." />
      </div>

      {/* Table */}
      <Table columns={columns} data={data.data} loading={loading} />
      <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier l\'enseignant' : 'Nouvel enseignant'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations personnelles */}
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Informations personnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom *"
                value={form.firstName}
                error={errors.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <Input
                label="Nom *"
                value={form.lastName}
                error={errors.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <Input
                label="Email *"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={!!editingId}
              />
              <Input
                label="Téléphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label={editingId ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe *'}
                type="password"
                value={form.password}
                error={errors.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder={editingId ? 'Laisser vide pour ne pas changer' : ''}
              />
            </div>
          </div>

          {/* Informations professionnelles */}
          <div>
            <h4 className="font-medium text-sm text-gray-500 mb-2">Informations professionnelles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Matricule *"
                value={form.employeeId}
                error={errors.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                placeholder="Ex: TCH-005"
              />
              <Input
                label="Date d'embauche"
                type="date"
                value={form.hireDate}
                onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
              />
              <Input
                label="Spécialité"
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                placeholder="Ex: Mathématiques"
              />
              <Select
                label="Diplôme"
                value={form.diploma}
                onChange={(e) => setForm({ ...form, diploma: e.target.value })}
                options={DIPLOMAS}
              />
              <Input
                label="Salaire (€)"
                type="number"
                step="0.01"
                min="0"
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="secondary" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============ MODAL DETAIL ============ */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title="Détails de l'enseignant"
        size="lg"
      >
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
                {selectedTeacher.user?.firstName?.[0]}
                {selectedTeacher.user?.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {selectedTeacher.user?.firstName} {selectedTeacher.user?.lastName}
                </h3>
                <p className="text-sm text-gray-500">{selectedTeacher.employeeId}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{selectedTeacher.user?.email}</p>
              </div>
              <div>
                <p className="text-gray-500">Téléphone</p>
                <p className="font-medium">{selectedTeacher.user?.phone || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Spécialité</p>
                <p className="font-medium">{selectedTeacher.specialization || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Diplôme</p>
                <p className="font-medium">{selectedTeacher.diploma || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">Date d'embauche</p>
                <p className="font-medium">{formatDate(selectedTeacher.hireDate)}</p>
              </div>
              <div>
                <p className="text-gray-500">Salaire</p>
                <p className="font-medium">{selectedTeacher.salary ? `${selectedTeacher.salary} €` : '—'}</p>
              </div>
            </div>

            {selectedTeacher.subjects?.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">Matières enseignées</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.subjects.map((s) => (
                    <Badge key={s.id} variant="info">{s.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedTeacher.classes?.length > 0 && (
              <div>
                <p className="text-gray-500 text-sm mb-2">Classes assignées</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTeacher.classes.map((c) => (
                    <Badge key={c.id} variant="success">{c.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ============ CONFIRM DELETE ============ */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer l'enseignant"
        message="Voulez-vous vraiment supprimer cet enseignant ? Cette action supprimera aussi son compte utilisateur."
      />
    </div>
  );
}