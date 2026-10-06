import { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import Table from '../../common/Table';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../..//common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import Card from '../../common/Card';
import { gradeService } from '../../service/gradeService';
import { studentService } from '../../service/studentService';
import { subjectService } from '../../service/subjectService';
import { formatDate } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';

// ============ CONSTANTES ============
const EMPTY_FORM = {
  studentId: '',
  subjectId: '',
  value: '',
  coefficient: 1,
  type: 'devoir',
  semester: 1,
  date: new Date().toISOString().slice(0, 10),
  comment: '',
};

const GRADE_TYPES = [
  { value: 'devoir', label: 'Devoir' },
  { value: 'examen', label: 'Examen' },
  { value: 'interrogation', label: 'Interrogation' },
  { value: 'tp', label: 'Travaux pratiques' },
];

const SEMESTERS = [
  { value: 1, label: 'Semestre 1' },
  { value: 2, label: 'Semestre 2' },
];

const TYPE_VARIANTS = {
  devoir: 'info',
  examen: 'danger',
  interrogation: 'warning',
  tp: 'success',
};

// ============ COMPOSANT ============
export default function GradesPage() {
  const toast = useToast();

  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterSemester, setFilterSemester] = useState('');

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ============ FETCH ============
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [g, s, sub] = await Promise.all([
        gradeService.getAll(),
        studentService.getAll({ limit: 1000 }),
        subjectService.getAll(),
      ]);
      setGrades(g);
      setStudents(s.data || s);
      setSubjects(sub);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ FILTRAGE ============
  const filteredGrades = useMemo(() => {
    return grades.filter((g) => {
      const fullName = `${g.student?.user?.firstName || ''} ${g.student?.user?.lastName || ''}`.toLowerCase();
      const subjectName = (g.subject?.name || '').toLowerCase();
      const matchesSearch =
        !search ||
        fullName.includes(search.toLowerCase()) ||
        subjectName.includes(search.toLowerCase());

      const matchesSubject = !filterSubject || g.subjectId === filterSubject;
      const matchesType = !filterType || g.type === filterType;
      const matchesSemester = !filterSemester || String(g.semester) === String(filterSemester);

      return matchesSearch && matchesSubject && matchesType && matchesSemester;
    });
  }, [grades, search, filterSubject, filterType, filterSemester]);

  // ============ STATS ============
  const stats = useMemo(() => {
    if (!filteredGrades.length) return { avg: 0, count: 0, highest: 0, lowest: 0 };
    const values = filteredGrades.map((g) => parseFloat(g.value) || 0);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return {
      avg: avg.toFixed(2),
      count: filteredGrades.length,
      highest: Math.max(...values).toFixed(2),
      lowest: Math.min(...values).toFixed(2),
    };
  }, [filteredGrades]);

  // ============ OPEN FORM ============
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (grade) => {
    setForm({
      studentId: grade.studentId || '',
      subjectId: grade.subjectId || '',
      value: grade.value || '',
      coefficient: grade.coefficient || 1,
      type: grade.type || 'devoir',
      semester: grade.semester || 1,
      date: grade.date?.slice(0, 10) || new Date().toISOString().slice(0, 10),
      comment: grade.comment || '',
    });
    setErrors({});
    setEditingId(grade.id);
    setIsFormOpen(true);
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.studentId) e.studentId = 'Étudiant requis';
    if (!form.subjectId) e.subjectId = 'Matière requise';
    if (form.value === '' || isNaN(form.value)) e.value = 'Note invalide';
    else if (Number(form.value) < 0 || Number(form.value) > 20)
      e.value = 'La note doit être entre 0 et 20';
    if (!form.type) e.type = 'Type requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============ SUBMIT ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        value: parseFloat(form.value),
        coefficient: parseInt(form.coefficient),
        semester: parseInt(form.semester),
      };

      if (editingId) {
        await gradeService.update(editingId, payload);
        toast.success('Note mise à jour');
      } else {
        await gradeService.create(payload);
        toast.success('Note ajoutée');
      }

      setIsFormOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  // ============ DELETE ============
  const handleDelete = async () => {
    try {
      await gradeService.remove(deleteId);
      toast.success('Note supprimée');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ============ RESET FILTRES ============
  const resetFilters = () => {
    setSearch('');
    setFilterSubject('');
    setFilterType('');
    setFilterSemester('');
  };

  // ============ COLUMNS ============
  const columns = [
    {
      key: 'student',
      label: 'Étudiant',
      render: (r) =>
        `${r.student?.user?.firstName || ''} ${r.student?.user?.lastName || ''}`.trim() || '—',
    },
    {
      key: 'subject',
      label: 'Matière',
      render: (r) => r.subject?.name || '—',
    },
    {
      key: 'value',
      label: 'Note',
      render: (r) => {
        const v = parseFloat(r.value);
        const color = v >= 15 ? 'text-green-600' : v >= 10 ? 'text-yellow-600' : 'text-red-600';
        return <strong className={color}>{r.value}/20</strong>;
      },
    },
    {
      key: 'coefficient',
      label: 'Coef.',
      render: (r) => r.coefficient || 1,
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => (
        <Badge variant={TYPE_VARIANTS[r.type] || 'info'}>
          {GRADE_TYPES.find((t) => t.value === r.type)?.label || r.type}
        </Badge>
      ),
    },
    {
      key: 'semester',
      label: 'Semestre',
      render: (r) => `S${r.semester || 1}`,
    },
    {
      key: 'date',
      label: 'Date',
      render: (r) => formatDate(r.date),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEdit(r);
            }}
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
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-sm text-gray-500">
            {filteredGrades.length} note{filteredGrades.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Ajouter une note
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Moyenne" value={`${stats.avg}/20`} color="primary" />
        <Card title="Total notes" value={stats.count} color="green" />
        <Card title="Plus haute" value={`${stats.highest}/20`} color="yellow" />
        <Card title="Plus basse" value={`${stats.lowest}/20`} color="red" />
      </div>

      {/* Filtres */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Filter size={16} /> Filtres
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="input pl-10"
            />
          </div>
          <Select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            options={[
              { value: '', label: 'Toutes les matières' },
              ...subjects.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={[{ value: '', label: 'Tous les types' }, ...GRADE_TYPES]}
          />
          <Select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            options={[{ value: '', label: 'Tous les semestres' }, ...SEMESTERS]}
          />
        </div>
        {(search || filterSubject || filterType || filterSemester) && (
          <button
            onClick={resetFilters}
            className="text-xs text-primary-600 hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Table */}
      <Table columns={columns} data={filteredGrades} loading={loading} />

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier la note' : 'Ajouter une note'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Étudiant *"
            value={form.studentId}
            error={errors.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            options={[
              { value: '', label: '— Sélectionner un étudiant —' },
              ...students.map((s) => ({
                value: s.id,
                label: `${s.user?.firstName || ''} ${s.user?.lastName || ''} (${s.matricule || ''})`,
              })),
            ]}
          />

          <Select
            label="Matière *"
            value={form.subjectId}
            error={errors.subjectId}
            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            options={[
              { value: '', label: '— Sélectionner une matière —' },
              ...subjects.map((s) => ({ value: s.id, label: s.name })),
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Note / 20 *"
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={form.value}
              error={errors.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              placeholder="0.00"
            />
            <Input
              label="Coefficient"
              type="number"
              min="1"
              value={form.coefficient}
              onChange={(e) => setForm({ ...form, coefficient: e.target.value })}
            />
            <Select
              label="Type *"
              value={form.type}
              error={errors.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              options={GRADE_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Semestre"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              options={SEMESTERS}
            />
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div>
            <label className="label">Commentaire</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
              className="input"
              placeholder="Commentaire optionnel..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsFormOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ============ CONFIRM DELETE ============ */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setDeleteId(null);
        }}
        onConfirm={handleDelete}
        title="Supprimer la note"
        message="Voulez-vous vraiment supprimer cette note ? Cette action est irréversible."
      />
    </div>
  );
}