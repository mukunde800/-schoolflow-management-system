import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle } from 'lucide-react';
import Card from '../../common/Card';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import Modal from '../../common/Modal';
import Input from '../../common/Input';
import Select from '../../common/Select';
import ConfirmDialog from '../../common/ConfirmDialog';
import { paymentService } from '../../service/paymetService';
import { studentService } from '../../service/studentService';
import { formatDate, formatCurrency } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';

const EMPTY_FORM = {
  studentId: '',
  amount: '',
  type: 'scolarite',
  status: 'pending',
  dueDate: '',
  paidDate: '',
  method: '',
  reference: '',
  notes: '',
};

const PAYMENT_TYPES = [
  { value: 'inscription', label: 'Inscription' },
  { value: 'scolarite', label: 'Scolarité' },
  { value: 'cantine', label: 'Cantine' },
  { value: 'transport', label: 'Transport' },
  { value: 'autre', label: 'Autre' },
];

const PAYMENT_STATUS = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payé' },
  { value: 'overdue', label: 'En retard' },
  { value: 'cancelled', label: 'Annulé' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Espèces' },
  { value: 'card', label: 'Carte' },
  { value: 'transfer', label: 'Virement' },
  { value: 'mobile', label: 'Mobile Money' },
];

const statusVariant = {
  paid: 'success',
  pending: 'warning',
  overdue: 'danger',
  cancelled: 'default',
};

export default function PaymentsPage() {
  const toast = useToast();

  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const [p, s, st] = await Promise.all([
        paymentService.getAll(),
        studentService.getAll({ limit: 1000 }),
        paymentService.getStats(),
      ]);
      setPayments(p);
      setStudents(s.data || s);
      setStats(st);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des paiements');
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

  const openEdit = (payment) => {
    setForm({
      studentId: payment.studentId || '',
      amount: payment.amount || '',
      type: payment.type || 'scolarite',
      status: payment.status || 'pending',
      dueDate: payment.dueDate?.slice(0, 10) || '',
      paidDate: payment.paidDate?.slice(0, 10) || '',
      method: payment.method || '',
      reference: payment.reference || '',
      notes: payment.notes || '',
    });
    setErrors({});
    setEditingId(payment.id);
    setIsFormOpen(true);
  };

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.studentId) e.studentId = 'Étudiant requis';
    if (!form.amount || Number(form.amount) <= 0) e.amount = 'Montant invalide';
    if (!form.type) e.type = 'Type requis';
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
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        dueDate: form.dueDate || null,
        paidDate: form.paidDate || null,
        method: form.method || null,
      };

      if (editingId) {
        await paymentService.update(editingId, payload);
        toast.success('Paiement mis à jour');
      } else {
        await paymentService.create(payload);
        toast.success('Paiement créé');
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

  // ============ MARK AS PAID ============
  const handleMarkPaid = async (id) => {
    try {
      await paymentService.markAsPaid(id);
      toast.success('Paiement marqué comme payé');
      fetchAll();
    } catch {
      toast.error('Erreur');
    }
  };

  // ============ DELETE ============
  const handleDelete = async () => {
    try {
      await paymentService.remove(deleteId);
      toast.success('Paiement supprimé');
      setIsConfirmOpen(false);
      setDeleteId(null);
      fetchAll();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
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
      key: 'amount',
      label: 'Montant',
      render: (r) => <strong>{formatCurrency(r.amount)}</strong>,
    },
    {
      key: 'type',
      label: 'Type',
      render: (r) => r.type || '—',
    },
    {
      key: 'status',
      label: 'Statut',
      render: (r) => (
        <Badge variant={statusVariant[r.status] || 'default'}>
          {PAYMENT_STATUS.find((s) => s.value === r.status)?.label || r.status}
        </Badge>
      ),
    },
    {
      key: 'dueDate',
      label: 'Échéance',
      render: (r) => formatDate(r.dueDate),
    },
    {
      key: 'paidDate',
      label: 'Payé le',
      render: (r) => (r.paidDate ? formatDate(r.paidDate) : '—'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          {r.status !== 'paid' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkPaid(r.id);
              }}
              className="p-1.5 rounded hover:bg-green-100 text-green-600"
              title="Marquer comme payé"
            >
              <CheckCircle size={16} />
            </button>
          )}
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
          <h1 className="text-2xl font-bold">Paiements</h1>
          <p className="text-sm text-gray-500">{payments.length} paiements</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>
          Nouveau paiement
        </Button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            title="Encaissé"
            value={formatCurrency(stats.total || 0)}
            color="green"
          />
          <Card
            title="En attente"
            value={formatCurrency(stats.pending || 0)}
            color="yellow"
          />
          <Card
            title="En retard"
            value={formatCurrency(stats.overdue || 0)}
            color="red"
          />
        </div>
      )}

      {/* Table */}
      <Table columns={columns} data={payments} loading={loading} />

      {/* ============ MODAL FORM ============ */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Modifier le paiement' : 'Nouveau paiement'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Montant *"
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              error={errors.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
            />
            <Select
              label="Type *"
              value={form.type}
              error={errors.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              options={PAYMENT_TYPES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Statut *"
              value={form.status}
              error={errors.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              options={PAYMENT_STATUS}
            />
            <Select
              label="Méthode de paiement"
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              options={[{ value: '', label: '— Aucune —' }, ...PAYMENT_METHODS]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Date d'échéance"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            <Input
              label="Date de paiement"
              type="date"
              value={form.paidDate}
              onChange={(e) => setForm({ ...form, paidDate: e.target.value })}
            />
          </div>

          <Input
            label="Référence"
            value={form.reference}
            onChange={(e) => setForm({ ...form, reference: e.target.value })}
            placeholder="Ex: REF-1234"
          />

          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="input"
              placeholder="Notes additionnelles..."
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
        title="Supprimer le paiement"
        message="Voulez-vous vraiment supprimer ce paiement ? Cette action est irréversible."
      />
    </div>
  );
}