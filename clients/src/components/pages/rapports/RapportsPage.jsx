import { useEffect, useState } from 'react';
import {
  BarChart3, TrendingUp, Users, DollarSign, CalendarCheck,
  Download, RefreshCw, FileText,
} from 'lucide-react';
import Button from '../../common/Button';
import Card from '../../common/Card';
import Select from '../../common/Select';
import Input from '../../common/Input';
import Spinner from '../../common/Spiner';
import Badge from '../../common/Badge';
import BarChart from '../../charts/BarChart';
import PieChart from '../../charts/PieChart';
import LineChart from '../../charts/LineChart';
import { reportService } from '../../service/reportService';
import { classService } from '../../service/classService';
import { formatCurrency } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';

const TABS = [
  { id: 'grades', label: 'Notes', icon: BarChart3 },
  { id: 'attendance', label: 'Présences', icon: CalendarCheck },
  { id: 'payments', label: 'Paiements', icon: DollarSign },
  { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
];

export default function ReportsPage() {
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Données
  const [stats, setStats] = useState(null);
  const [gradeDist, setGradeDist] = useState([]);
  const [attendanceChart, setAttendanceChart] = useState([]);
  const [paymentStats, setPaymentStats] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [payments, setPayments] = useState([]);

  // Référentiels
  const [classes, setClasses] = useState([]);

  // Filtres
  const [filters, setFilters] = useState({
    classId: '',
    startDate: '',
    endDate: '',
    semester: '',
  });

  // ============ FETCH ============
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [
        s, gd, ac, ps, g, at, p, c,
      ] = await Promise.all([
        reportService.getStats().catch(() => null),
        reportService.getGradeDistribution(filters).catch(() => ({})),
        reportService.getAttendanceStats(filters).catch(() => []),
        reportService.getPaymentStats().catch(() => null),
        reportService.getGradesByClass(filters.classId, filters).catch(() => []),
        reportService.getAttendanceByClass(filters.classId, filters).catch(() => []),
        reportService.getStudentReport ? Promise.resolve([]) : Promise.resolve([]),
        classService.getAll().catch(() => []),
      ]);

      setStats(s);
      setGradeDist(
        typeof gd === 'object' && !Array.isArray(gd)
          ? Object.entries(gd).map(([name, value]) => ({ name, value }))
          : []
      );
      setAttendanceChart(Array.isArray(ac) ? ac : []);
      setPaymentStats(ps);
      setGrades(Array.isArray(g) ? g : []);
      setAttendances(Array.isArray(at) ? at : []);
      setClasses(Array.isArray(c) ? c : []);
    } catch (err) {
      console.error(err);
      toast.error('Erreur de chargement des rapports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ APPLIQUER FILTRES ============
  const applyFilters = () => {
    fetchAll();
    toast.success('Rapports actualisés');
  };

  const resetFilters = () => {
    setFilters({ classId: '', startDate: '', endDate: '', semester: '' });
    setTimeout(fetchAll, 100);
  };

  // ============ EXPORT CSV ============
  const exportCSV = () => {
    setExporting(true);
    try {
      let data = [];
      let filename = '';

      if (activeTab === 'grades') {
        data = grades.map((g) => ({
          Étudiant: `${g.student?.user?.firstName || ''} ${g.student?.user?.lastName || ''}`,
          Matière: g.subject?.name || '',
          Note: g.value,
          Coefficient: g.coefficient,
          Type: g.type,
          Date: g.date,
        }));
        filename = 'notes.csv';
      } else if (activeTab === 'attendance') {
        data = attendances.map((a) => ({
          Étudiant: `${a.student?.user?.firstName || ''} ${a.student?.user?.lastName || ''}`,
          Date: a.date,
          Statut: a.status,
          Justification: a.justification || '',
        }));
        filename = 'presences.csv';
      } else {
        toast.error('Aucune donnée à exporter');
        return;
      }

      if (data.length === 0) {
        toast.error('Aucune donnée à exporter');
        return;
      }

      const headers = Object.keys(data[0]);
      const csv = [
        headers.join(','),
        ...data.map((row) =>
          headers.map((h) => `"${row[h] ?? ''}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Export réussi');
    } catch (err) {
      toast.error('Erreur lors de l\'export');
    } finally {
      setExporting(false);
    }
  };

  // ============ CALCULS STATS ============
  const computeStats = () => {
    const gradesArray = grades.map((g) => parseFloat(g.value)).filter((v) => !isNaN(v));

    const average = gradesArray.length
      ? (gradesArray.reduce((s, v) => s + v, 0) / gradesArray.length).toFixed(2)
      : '—';

    const passRate = gradesArray.length
      ? ((gradesArray.filter((v) => v >= 10).length / gradesArray.length) * 100).toFixed(1)
      : '—';

    const absences = attendances.filter((a) => a.status === 'absent').length;
    const attendanceRate = attendances.length
      ? (((attendances.length - absences) / attendances.length) * 100).toFixed(1)
      : '—';

    return { average, passRate, absences, attendanceRate };
  };

  const computed = computeStats();

  // ============ RENDER ============
  if (loading) return <Spinner fullScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Rapports</h1>
          <p className="text-sm text-gray-500">
            Analyse et statistiques de l'établissement
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={<RefreshCw size={16} />}
            onClick={applyFilters}
          >
            Actualiser
          </Button>
          <Button
            icon={<Download size={16} />}
            onClick={exportCSV}
            loading={exporting}
          >
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Classe"
            value={filters.classId}
            onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
            options={[
              { value: '', label: 'Toutes les classes' },
              ...classes.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <Input
            label="Date de début"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <Input
            label="Date de fin"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
          <Select
            label="Semestre"
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            options={[
              { value: '', label: 'Tous' },
              { value: '1', label: 'Semestre 1' },
              { value: '2', label: 'Semestre 2' },
            ]}
          />
        </div>
        <div className="flex justify-end gap-2 mt-3">
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Réinitialiser
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Appliquer les filtres
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap
              border-b-2 transition-colors
              ${
                activeTab === id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* ============ TAB: OVERVIEW ============ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              title="Étudiants"
              value={stats?.totalStudents || 0}
              icon={<Users size={22} />}
              color="primary"
            />
            <Card
              title="Moyenne générale"
              value={`${computed.average}/20`}
              icon={<BarChart3 size={22} />}
              color="green"
            />
            <Card
              title="Taux de réussite"
              value={`${computed.passRate}%`}
              icon={<TrendingUp size={22} />}
              color="purple"
            />
            <Card
              title="Taux de présence"
              value={`${computed.attendanceRate}%`}
              icon={<CalendarCheck size={22} />}
              color="yellow"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Répartition des notes</h3>
              {gradeDist.length > 0 ? (
                <BarChart data={gradeDist} />
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucune donnée disponible
                </p>
              )}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Vue circulaire</h3>
              {gradeDist.length > 0 ? (
                <PieChart data={gradeDist} />
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Aucune donnée disponible
                </p>
              )}
            </div>
          </div>

          {/* Paiements */}
          {paymentStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                title="Encaissé"
                value={formatCurrency(paymentStats.total || 0)}
                color="green"
                icon={<DollarSign size={22} />}
              />
              <Card
                title="En attente"
                value={formatCurrency(paymentStats.pending || 0)}
                color="yellow"
                icon={<DollarSign size={22} />}
              />
              <Card
                title="En retard"
                value={formatCurrency(paymentStats.overdue || 0)}
                color="red"
                icon={<DollarSign size={22} />}
              />
            </div>
          )}
        </div>
      )}

      {/* ============ TAB: GRADES ============ */}
      {activeTab === 'grades' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Notes totales"
              value={grades.length}
              icon={<FileText size={22} />}
              color="primary"
            />
            <Card
              title="Moyenne"
              value={`${computed.average}/20`}
              icon={<BarChart3 size={22} />}
              color="green"
            />
            <Card
              title="Taux de réussite"
              value={`${computed.passRate}%`}
              icon={<TrendingUp size={22} />}
              color="purple"
            />
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Répartition des notes par tranche</h3>
            {gradeDist.length > 0 ? (
              <BarChart data={gradeDist} color="#10b981" />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Aucune donnée
              </p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Détail des notes ({grades.length})</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Étudiant</th>
                    <th className="px-4 py-2 text-left">Matière</th>
                    <th className="px-4 py-2 text-left">Note</th>
                    <th className="px-4 py-2 text-left">Coef.</th>
                    <th className="px-4 py-2 text-left">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {grades.slice(0, 50).map((g) => (
                    <tr key={g.id}>
                      <td className="px-4 py-2">
                        {g.student?.user?.firstName} {g.student?.user?.lastName}
                      </td>
                      <td className="px-4 py-2">{g.subject?.name || '—'}</td>
                      <td className="px-4 py-2">
                        <strong
                          className={
                            parseFloat(g.value) >= 10
                              ? 'text-green-600'
                              : 'text-red-600'
                          }
                        >
                          {g.value}/20
                        </strong>
                      </td>
                      <td className="px-4 py-2">{g.coefficient}</td>
                      <td className="px-4 py-2">
                        <Badge variant="info">{g.type}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {grades.length > 50 && (
                <p className="text-xs text-gray-500 text-center py-2">
                  50 premières notes sur {grades.length} affichées
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: ATTENDANCE ============ */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              title="Total présences"
              value={attendances.length}
              icon={<CalendarCheck size={22} />}
              color="primary"
            />
            <Card
              title="Absences"
              value={computed.absences}
              icon={<CalendarCheck size={22} />}
              color="red"
            />
            <Card
              title="Taux de présence"
              value={`${computed.attendanceRate}%`}
              icon={<TrendingUp size={22} />}
              color="green"
            />
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Évolution des présences</h3>
            {attendanceChart.length > 0 ? (
              <LineChart data={attendanceChart} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                Aucune donnée sur la période
              </p>
            )}
          </div>

          <div className="card p-6">
            <h3 className="font-semibold mb-4">Détail des présences ({attendances.length})</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">Étudiant</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {attendances.slice(0, 50).map((a) => (
                    <tr key={a.id}>
                      <td className="px-4 py-2">
                        {a.student?.user?.firstName} {a.student?.user?.lastName}
                      </td>
                      <td className="px-4 py-2">{a.date}</td>
                      <td className="px-4 py-2">
                        <Badge
                          variant={
                            a.status === 'present'
                              ? 'success'
                              : a.status === 'absent'
                              ? 'danger'
                              : a.status === 'late'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {a.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============ TAB: PAYMENTS ============ */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {paymentStats ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  title="Encaissé"
                  value={formatCurrency(paymentStats.total || 0)}
                  icon={<DollarSign size={22} />}
                  color="green"
                />
                <Card
                  title="En attente"
                  value={formatCurrency(paymentStats.pending || 0)}
                  icon={<DollarSign size={22} />}
                  color="yellow"
                />
                <Card
                  title="En retard"
                  value={formatCurrency(paymentStats.overdue || 0)}
                  icon={<DollarSign size={22} />}
                  color="red"
                />
              </div>

              <div className="card p-6">
                <h3 className="font-semibold mb-4">Répartition des paiements</h3>
                <PieChart
                  data={[
                    { name: 'Payé', value: parseFloat(paymentStats.total || 0) },
                    { name: 'En attente', value: parseFloat(paymentStats.pending || 0) },
                    { name: 'En retard', value: parseFloat(paymentStats.overdue || 0) },
                  ]}
                />
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-10">
              Aucune donnée de paiement disponible
            </p>
          )}
        </div>
      )}
    </div>
  );
}