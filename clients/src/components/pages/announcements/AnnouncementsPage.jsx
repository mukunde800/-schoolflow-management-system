import { useEffect, useState } from 'react';
import { Plus, Megaphone, Pencil, Trash2, Calendar, User as UserIcon } from 'lucide-react';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import Spinner from '../../common/Spiner';
import { announcementService } from '../../service/announcementService';
import { classService } from '../../service/classService';
import { formatDate } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';
import { useAuth } from '../../../context/AuthContext';

// ==================== CONSTANTES ====================
const EMPTY_FORM = {
  title: '',
  content: '',
  targetRole: 'all',
  classId: '',
  priority: 'normal',
  expiresAt: '',
};

const TARGET_ROLES = [
  { value: 'all', label: 'Tout le monde' },
  { value: 'admin', label: 'Administrateurs' },
  { value: 'teacher', label: 'Enseignants' },
  { value: 'student', label: 'Étudiants' },
  { value: 'parent', label: 'Parents' },
];

const PRIORITIES = [
  { value: 'low', label: 'Basse' },
  { value: 'normal', label: 'Normale' },
  { value: 'high', label: 'Haute' },
];

const priorityVariant = {
  low: 'default',
  normal: 'info',
  high: 'danger',
};

const priorityLabel = {
  low: 'Basse',
  normal: 'Normale',
  high: 'Haute',
};

// ==================== COMPOSANT ====================
export default function AnnouncementsPage() {
  const toast = useToast();
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtres
  const [filterPriority, setFilterPriority] = useState('');
  const [filterTarget, setFilterTarget] = useState('');

  // Modales
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const canManage = ['admin', 'teacher'].includes(user?.role);
  const canDelete = user?.role === 'admin';

  // ==================== FETCH ====================
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [a, c] = await Promise.all([
        announcementService.getAll(),
        classService.getAll().catch(() => []),
      ]);
      setItems(Array.isArray(a) ? a : []);
      setClasses(Array.isArray(c) ? c : []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des annonces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ==================== FILTRAGE ====================
  const filteredItems = items.filter((a) => {
    if (filterPriority && a.priority !== filterPriority) return false;
    if (filterTarget && a.targetRole !== filterTarget) return false;
    return true;
  });

  // ==================== OPEN FORM ====================
  const openCreate = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEdit = (item) => {
    setForm({
      title: item.title || '',
      content: item.content || '',
      targetRole: item.targetRole || 'all',
      classId: item.classId || '',
      priority: item.priority || 'normal',
      expiresAt: item.expiresAt?.slice(0, 10) || '',
    });
    setErrors({});
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const openDetail = (item) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  // ==================== VALIDATION ====================
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Titre requis';
    if (!form.content.trim()) e.content = 'Contenu requis';
    if (form.title.length > 255) e.title = 'Titre trop long (max 255)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ==================== SUBMIT ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        classId: form.classId || null,
        expiresAt: form.expiresAt || null,
      };

      if (editingId) {
        await announcementService.update(editingId, payload);
        toast.success('Annonce mise à jour');
      } else {
        await announcementService.create(payload);
        toast.success('Annonce créée');
      }

      setIsFormOpen(false);
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  // ==================== DELETE ====================
  const handleDelete = async () => {
    try {
      await announcementService.remove(deleteId);
      toast.success('Annonce supprimée');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Annonces</h1>
          <p className="text-sm text-gray-500">
            {filteredItems.length} annonce{filteredItems.length > 1 ? 's' : ''}
          </p>
        </div>
        {canManage && (
          <Button icon={<Plus size={16} />} onClick={openCreate}>
            Nouvelle annonce
          </Button>
        )}
      </div>

      {/* FILTRES */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <Select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            options={[{ value: '', label: 'Toutes les priorités' }, ...PRIORITIES]}
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <Select
            value={filterTarget}
            onChange={(e) => setFilterTarget(e.target.value)}
            options={[{ value: '', label: 'Tous les publics' }, ...TARGET_ROLES]}
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setFilterPriority('');
            setFilterTarget('');
          }}
        >
          Réinitialiser
        </Button>
      </div>

      {/* LISTE */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="card p-10 text-center text-gray-500">
          <Megaphone size={48} className="mx-auto mb-3 opacity-30" />
          <p>Aucune annonce trouvée</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((a) => (
            <div
              key={a.id}
              className="card p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openDetail(a)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600">
                  <Megaphone size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{a.title}</h3>
                    <Badge variant={priorityVariant[a.priority] || 'info'}>
                      {priorityLabel[a.priority] || a.priority}
                    </Badge>
                    {a.targetRole && a.targetRole !== 'all' && (
                      <Badge variant="info">
                        {TARGET_ROLES.find((r) => r.value === a.targetRole)?.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {a.content}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(a.publishedAt)}
                    </span>
                    {a.author && (
                      <span className="flex items-center gap-1">
                        <UserIcon size={12} />
                        {a.author.firstName} {a.author.lastName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {canManage && (
                  <div
                    className="flex gap-2 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => openEdit(a)}
                      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      title="Modifier"
                    >
                      <Pencil size={16} />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => {
                          setDeleteId(a.id);
                          setIsConfirmOpen(true);
                        }}
                        className="p-1.5 rounded hover:bg-red-100 text-red-500"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============ MODAL DÉTAIL ============ */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem?.title || 'Détail'}
        size="lg"
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant={priorityVariant[selectedItem.priority] || 'info'}>
                Priorité : {priorityLabel[selectedItem.priority] || selectedItem.priority}
              </Badge>
              {selectedItem.targetRole && (
                <Badge variant="info">
                  Cible : {TARGET_ROLES.find((r) => r.value === selectedItem.targetRole)?.label}
                </Badge>
              )}
              {selectedItem.class && (
                <Badge variant="success">
                  Classe : {selectedItem.class.name}
                </Badge>
              )}
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {selectedItem.content}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 pt-3 border-t">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Publié le {formatDate(selectedItem.publishedAt)}
              </span>
              {selectedItem.expiresAt && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  Expire le {formatDate(selectedItem.expiresAt)}
                </span>
              )}
              {selectedItem.author && (
                <span className="flex items-center gap-1">
                  <UserIcon size={12} />
                  {selectedItem.author.firstName} {selectedItem.author.lastName}
                </span>
              )}
            </div>

            {canManage && (
              <div className="flex justify-end gap-2 pt-3 border-t">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEdit(selectedItem);
                  }}
                >
                  Modifier
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier l\'annonce' : 'Nouvelle annonce'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Titre *"
            value={form.title}
            error={errors.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Réunion parents-professeurs"
          />

          <div>
            <label className="label">Contenu *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={6}
              className={`input ${errors.content ? 'border-red-500' : ''}`}
              placeholder="Écrivez le contenu de l'annonce..."
            />
            {errors.content && (
              <p className="text-xs text-red-500 mt-1">{errors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Priorité"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              options={PRIORITIES}
            />
            <Select
              label="Public cible"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
              options={TARGET_ROLES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Classe spécifique (optionnel)"
              value={form.classId}
              onChange={(e) => setForm({ ...form, classId: e.target.value })}
              options={[
                { value: '', label: '— Toutes les classes —' },
                ...classes.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <Input
              label="Date d'expiration (optionnel)"
              type="date"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
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
              {editingId ? 'Enregistrer' : 'Publier'}
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
        title="Supprimer l'annonce"
        message="Voulez-vous vraiment supprimer cette annonce ? Cette action est irréversible."
      />
    </div>
  );
}