import { useEffect, useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, CalendarDays,} from 'lucide-react';
import Spinner from '../../common/Spiner';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import Badge from '../../common/Badge';
import { scheduleService } from '../../service/scheduleService';
import { classService } from '../../service/classService';
import { teacherService } from '../../service/teacherService';
import api from '../../service/api';
import useToast from '../../hooks/useToast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
};

const EMPTY_FORM = {
  classId: '',
  subjectId: '',
  teacherId: '',
  dayOfWeek: 'monday',
  startTime: '08:00',
  endTime: '10:00',
  room: '',
};

export default function SchedulesPage() {
  const toast = useToast();

  const [schedules, setSchedules] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [filterClass, setFilterClass] = useState('');

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
      const [s, c, t] = await Promise.all([
        scheduleService.getAll(filterClass ? { classId: filterClass } : {}),
        classService.getAll(),
        teacherService.getAll({ limit: 1000 }),
      ]);

      // Récupérer les matières via l'API
      const subjRes = await api.get('/subjects').catch(() => ({ data: [] }));

      setSchedules(Array.isArray(s) ? s : []);
      setClasses(Array.isArray(c) ? c : []);
      setTeachers(t.data || t || []);
      setSubjects(subjRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterClass]);

  // ============ OPEN FORM ============
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (schedule) => {
    setForm({
      classId: schedule.classId || '',
      subjectId: schedule.subjectId || '',
      teacherId: schedule.teacherId || '',
      dayOfWeek: schedule.dayOfWeek || 'monday',
      startTime: schedule.startTime?.slice(0, 5) || '08:00',
      endTime: schedule.endTime?.slice(0, 5) || '10:00',
      room: schedule.room || '',
    });
    setErrors({});
    setEditingId(schedule.id);
    setIsFormOpen(true);
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.classId) e.classId = 'Classe requise';
    if (!form.subjectId) e.subjectId = 'Matière requise';
    if (!form.dayOfWeek) e.dayOfWeek = 'Jour requis';
    if (!form.startTime) e.startTime = 'Heure de début requise';
    if (!form.endTime) e.endTime = 'Heure de fin requise';
    if (form.startTime >= form.endTime) e.endTime = 'L\'heure de fin doit être après le début';
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
        teacherId: form.teacherId || null,
      };

      if (editingId) {
        await scheduleService.update(editingId, payload);
        toast.success('Créneau mis à jour');
      } else {
        await scheduleService.create(payload);
        toast.success('Créneau ajouté');
      }

      setIsFormOpen(false);
      fetchAll();
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
      await scheduleService.remove(deleteId);
      toast.success('Créneau supprimé');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ============ GROUPEMENT PAR JOUR ============
  const schedulesByDay = useMemo(() => {
    const grouped = {};
    DAYS.forEach((d) => (grouped[d] = []));
    schedules.forEach((s) => {
      if (grouped[s.dayOfWeek]) {
        grouped[s.dayOfWeek].push(s);
      }
    });
    return grouped;
  }, [schedules]);

  // ============ RENDER ============
  if (loading) return <Spinner fullScreen />;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Emploi du temps</h1>
          <p className="text-sm text-gray-500">{schedules.length} créneaux</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            options={[
              { value: '', label: 'Toutes les classes' },
              ...classes.map((c) => ({ value: c.id, label: c.name })),
            ]}
            className="w-48"
          />
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Nouveau créneau
          </Button>
        </div>
      </div>

      {/* Grille hebdomadaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {DAYS.map((day) => (
          <div key={day} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CalendarDays size={16} className="text-primary-600" />
                {DAY_LABELS[day]}
              </h3>
              <Badge variant="info">{schedulesByDay[day].length}</Badge>
            </div>

            <div className="space-y-2">
              {schedulesByDay[day].length > 0 ? (
                schedulesByDay[day]
                  .sort((a, b) => a.startTime?.localeCompare(b.startTime))
                  .map((s) => (
                    <div
                      key={s.id}
                      className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-xs border border-primary-100 dark:border-primary-800 group relative"
                    >
                      <p className="font-medium text-primary-900 dark:text-primary-100">
                        {s.subject?.name || 'Matière'}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                        {s.startTime?.slice(0, 5)} - {s.endTime?.slice(0, 5)}
                      </p>
                      {s.class?.name && (
                        <p className="text-gray-500 text-[10px] mt-1">{s.class.name}</p>
                      )}
                      {s.room && (
                        <p className="text-gray-500 text-[10px]">Salle {s.room}</p>
                      )}

                      {/* Actions au survol */}
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-0.5">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1 rounded bg-white dark:bg-gray-800 shadow hover:bg-gray-100"
                          title="Modifier"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(s.id);
                            setIsConfirmOpen(true);
                          }}
                          className="p-1 rounded bg-white dark:bg-gray-800 shadow hover:bg-red-100 text-red-500"
                          title="Supprimer"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-xs text-gray-400 text-center py-4">Libre</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier le créneau' : 'Nouveau créneau'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Classe *"
              value={form.classId}
              error={errors.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              options={[
                { value: '', label: '— Sélectionner —' },
                ...classes.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Select
              label="Matière *"
              value={form.subjectId}
              error={errors.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              options={[
                { value: '', label: '— Sélectionner —' },
                ...subjects.map((s) => ({ value: s.id, label: s.name })),
              ]}
            />
          </div>

          <Select
            label="Enseignant"
            value={form.teacherId}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            options={[
              { value: '', label: '— Aucun —' },
              ...teachers.map((t) => ({
                value: t.id,
                label: `${t.user?.firstName || ''} ${t.user?.lastName || ''}`,
              })),
            ]}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Jour *"
              value={form.dayOfWeek}
              error={errors.dayOfWeek}
              onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
              options={DAYS.map((d) => ({ value: d, label: DAY_LABELS[d] }))}
            />
            <Input
              label="Début *"
              type="time"
              value={form.startTime}
              error={errors.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <Input
              label="Fin *"
              type="time"
              value={form.endTime}
              error={errors.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>

          <Input
            label="Salle"
            value={form.room}
            onChange={(e) => setForm({ ...form, room: e.target.value })}
            placeholder="Ex: 101"
          />

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
        title="Supprimer le créneau"
        message="Voulez-vous vraiment supprimer ce créneau de l'emploi du temps ?"
      />
    </div>
  );
}