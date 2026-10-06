import { useEffect, useState } from 'react';
import { Plus, BookOpen, Pencil, Trash2, Users, DoorOpen } from 'lucide-react';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import Spinner from '../../common/Spiner';
import { classService } from '../../service/classService';
import useToast from '../../hooks/useToast';

const EMPTY_FORM = {
  name: '',
  level: '6ème',
  academicYear: '2024-2025',
  capacity: 40,
  room: '',
  description: '',
};

const LEVELS = [
  { value: '6ème', label: '6ème' },
  { value: '5ème', label: '5ème' },
  { value: '4ème', label: '4ème' },
  { value: '3ème', label: '3ème' },
  { value: '2nde', label: '2nde' },
  { value: '1ère', label: '1ère' },
  { value: 'Terminale', label: 'Terminale' },
];

export default function ClassesListPage() {
  const toast = useToast();

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // État des modales
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
      const data = await classService.getAll();
      setClasses(data);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ OPEN FORM ============
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (cls) => {
    setForm({
      name: cls.name || '',
      level: cls.level || '6ème',
      academicYear: cls.academicYear || '2024-2025',
      capacity: cls.capacity || 40,
      room: cls.room || '',
      description: cls.description || '',
    });
    setErrors({});
    setEditingId(cls.id);
    setIsFormOpen(true);
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = 'Nom requis';
    if (!form.level) e.level = 'Niveau requis';
    if (!form.academicYear?.trim()) e.academicYear = 'Année scolaire requise';
    if (form.capacity && (isNaN(form.capacity) || Number(form.capacity) <= 0)) {
      e.capacity = 'Capacité invalide';
    }
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
        capacity: Number(form.capacity) || 40,
      };

      if (editingId) {
        await classService.update(editingId, payload);
        toast.success('Classe mise à jour');
      } else {
        await classService.create(payload);
        toast.success('Classe créée');
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
      await classService.remove(deleteId);
      toast.success('Classe supprimée');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  // ============ LOADING ============
  if (loading) return <Spinner fullScreen />;

  // ============ RENDER ============
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Classes</h1>
          <p className="text-sm text-gray-500">{classes.length} classes</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Nouvelle classe
        </Button>
      </div>

      {/* Grid de classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <div
            key={c.id}
            className="card p-5 hover:shadow-lg transition-shadow relative group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                <BookOpen size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{c.name}</h3>
                <p className="text-xs text-gray-500">
                  {c.level || '—'} — {c.academicYear || '—'}
                </p>

                <div className="mt-3 flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {c.students?.length || 0} étudiants
                  </span>
                  <span className="text-gray-500 flex items-center gap-1">
                    <DoorOpen size={14} />
                    Cap. {c.capacity || '—'}
                  </span>
                </div>

                {c.room && (
                  <p className="text-xs text-gray-400 mt-2">Salle : {c.room}</p>
                )}
              </div>
            </div>

            {/* Actions (visibles au survol) */}
            <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-700 shadow hover:bg-gray-100 dark:hover:bg-gray-600"
                title="Modifier"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => {
                  setDeleteId(c.id);
                  setIsConfirmOpen(true);
                }}
                className="p-1.5 rounded-lg bg-white dark:bg-gray-700 shadow hover:bg-red-100 text-red-500"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {!classes.length && (
          <div className="col-span-full text-center py-16 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
            <p>Aucune classe pour le moment</p>
            <Button
              icon={<Plus size={16} />}
              onClick={openCreate}
              className="mt-4"
            >
              Créer la première classe
            </Button>
          </div>
        )}
      </div>

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier la classe' : 'Nouvelle classe'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nom de la classe *"
            value={form.name}
            error={errors.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Ex : 6ème A"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Niveau *"
              value={form.level}
              error={errors.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              options={LEVELS}
            />
            <Input
              label="Année scolaire *"
              value={form.academicYear}
              error={errors.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              placeholder="2024-2025"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Capacité"
              type="number"
              min="1"
              value={form.capacity}
              error={errors.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <Input
              label="Salle"
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="Ex : Salle 101"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input"
              placeholder="Description de la classe..."
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
        title="Supprimer la classe"
        message="Voulez-vous vraiment supprimer cette classe ? Les étudiants associés perdront leur affectation."
      />
    </div>
  );
}