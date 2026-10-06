import { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import Card from '../../common/Card';
import { attendanceService } from '../../service/attendanceService';
import { studentService } from '../../service/studentService';
import { classService } from '../../service/classService';
import { formatDate } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';

// ==================== CONSTANTES ====================
const STATUS_OPTIONS = [
  { value: 'present', label: 'Présent' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Retard' },
  { value: 'excused', label: 'Excusé' },
];

const STATUS_VARIANT = {
  present: 'success',
  absent: 'danger',
  late: 'warning',
  excused: 'info',
};

const EMPTY_FORM = {
  studentId: '',
  classId: '',
  date: new Date().toISOString().slice(0, 10),
  status: 'present',
  justification: '',
};

// ==================== COMPOSANT ====================
export default function AttendancePage() {
  const toast = useToast();

  // Data
  const [attendances, setAttendances] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [filterDate, setFilterDate] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // ============ FETCH ============
  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterClass) params.classId = filterClass;

      const data = await attendanceService.getAll(params);
      setAttendances(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [st, cl] = await Promise.all([
        studentService.getAll({ limit: 1000 }),
        classService.getAll(),
      ]);
      setStudents(st.data || st);
      setClasses(Array.isArray(cl) ? cl : cl.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchAttendances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, filterClass]);

  // ============ FILTRES CLIENT ============
  const filteredAttendances = useMemo(() => {
    let result = attendances;
    if (filterStatus) {
      result = result.filter((a) => a.status === filterStatus);
    }
    return result;
  }, [attendances, filterStatus]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const s = { present: 0, absent: 0, late: 0, excused: 0 };
    filteredAttendances.forEach((a) => {
      if (s[a.status] !== undefined) s[a.status]++;
    });
    return s;
  }, [filteredAttendances]);

  // ============ OUVERTURE FORM ============
  const openCreate = () => {
    setForm({ ...EMPTY_FORM, date: new Date().toISOString().slice(0, 10) });
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (attendance) => {
    setForm({
      studentId: attendance.studentId || '',
      classId: attendance.classId || '',
      date: attendance.date?.slice(0, 10) || '',
      status: attendance.status || 'present',
      justification: attendance.justification || '',
    });
    setErrors({});
    setEditingId(attendance.id);
    setIsFormOpen(true);
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.studentId) e.studentId = 'Étudiant requis';
    if (!form.date) e.date = 'Date requise';
    if (!form.status) e.status = 'Statut requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============ SUBMIT ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      // Récupérer la classe de l'étudiant si non fournie
      let classId = form.classId;
      if (!classId && form.studentId) {
        const student = students.find((s) => s.id === form.studentId);
        classId = student?.classId || null;
      }

      const payload = {
        studentId: form.studentId,
        classId,
        date: form.date,
        status: form.status,
        justification: form.justification || null,
      };

      if (editingId) {
        await attendanceService.update(editingId, payload);
        toast.success('Présence mise à jour');
      } else {
        await attendanceService.create(payload);
        toast.success('Présence enregistrée');
      }

      setIsFormOpen(false);
      fetchAttendances();
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
      await attendanceService.remove(deleteId);
      toast.success('Présence supprimée');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAttendances();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ============ RESET FILTRES ============
  const resetFilters = () => {
    setFilterDate('');
    setFilterClass('');
    setFilterStatus('');
  };

  // ============ COLUMNS ============
  const columns = [
    {
      key: 'student',
      label: 'Étudiant',
      render: (r) => {
        const name = `${r.student?.user?.firstName || ''} ${r.student?.user?.lastName || ''}`.trim();
        return name || <span className="text-gray-400">Inconnu</span>;
      },
    },
    {
      key: 'class',
      label: 'Classe',
      render: (r) => r.student?.class?.name || r.class?.name || '—',
    },
    {
      key: 'date',
      label: 'Date',
      render: (r) => formatDate(r.date),
    },
    {
      key: 'status',
      label: 'Statut',
      render: (r) => (
        <Badge variant={STATUS_VARIANT[r.status] || 'default'}>
          {STATUS_OPTIONS.find((s) => s.value === r.status)?.label || r.status}
        </Badge>
      ),
    },
    {
      key: 'justification',
      label: 'Justification',
      render: (r) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {r.justification || '—'}
        </span>
      ),
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
          <h1 className="text-2xl font-bold">Présences</h1>
          <p className="text-sm text-gray-500">
            {filteredAttendances.length} enregistrement{filteredAttendances.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Nouvelle présence
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Présents" value={stats.present} color="green" />
        <Card title="Absents" value={stats.absent} color="red" />
        <Card title="Retards" value={stats.late} color="yellow" />
        <Card title="Excusés" value={stats.excused} color="primary" />
      </div>

      {/* Filtres */}
      <div className="card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} className="text-gray-500" />
          <h3 className="text-sm font-semibold">Filtres</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            type="date"
            label="Date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <Select
            label="Classe"
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={[
              { value: '', label: 'Toutes les classes' },
              ...classes.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Select
            label="Statut"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            options={[
              { value: '', label: 'Tous les statuts' },
              ...STATUS_OPTIONS,
            ]}
          />
          <div className="flex items-end">
            <Button variant="secondary" onClick={resetFilters} className="w-full">
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredAttendances}
        loading={loading}
        emptyMessage="Aucune présence enregistrée"
      />

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier la présence' : 'Nouvelle présence'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Étudiant *"
            value={form.studentId}
            error={errors.studentId}
            onChange={(e) => {
              const studentId = e.target.value;
              const student = students.find((s) => s.id === studentId);
              setForm({
                ...form,
                studentId,
                classId: student?.classId || form.classId,
              });
            }}
            options={[
              { value: '', label: '— Sélectionner un étudiant —' },
              ...students.map((s) => ({
                value: s.id,
                label: `${s.user?.firstName || ''} ${s.user?.lastName || ''} (${s.matricule || ''})`,
              })),
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date *"
              type="date"
              value={form.date}
              error={errors.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <Select
              label="Statut *"
              value={form.status}
              error={errors.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={STATUS_OPTIONS}
            />
          </div>

          <div>
            <label className="label">Justification</label>
            <textarea
              value={form.justification}
              onChange={(e) => setForm({ ...form, justification: e.target.value })}
              rows={3}
              className="input"
              placeholder="Raison de l'absence, du retard..."
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
        title="Supprimer la présence"
        message="Voulez-vous vraiment supprimer cet enregistrement de présence ?"
      />
    </div>
  );
}