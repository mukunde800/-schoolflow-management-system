import { useEffect, useState } from 'react';
import { Users, GraduationCap, BookOpen, DollarSign } from 'lucide-react';
import Card from '../../common/Card';
import Spinner from '../../common/Spiner';
import BarChart from '../../charts/BarChart';
import PieChart from '../../charts/PieChart';
import { dashboardService } from '../../service/dashboardService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [dist, setDist] = useState(null);

  useEffect(() => {
    Promise.all([dashboardService.getStats(), dashboardService.getGradeDistribution()])
      .then(([s, d]) => { setStats(s); setDist(d); });
  }, []);

  if (!stats) return <Spinner fullScreen />;

  const chartData = Object.entries(dist || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Vue d'ensemble de l'établissement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Étudiants" value={stats.totalStudents} icon={<Users size={22} />} color="primary" />
        <Card title="Enseignants" value={stats.totalTeachers} icon={<GraduationCap size={22} />} color="green" />
        <Card title="Classes" value={stats.totalClasses} icon={<BookOpen size={22} />} color="purple" />
        <Card title="Paiements reçus" value={`${stats.payments.paid} €`} icon={<DollarSign size={22} />} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Répartition des notes</h3>
          <PieChart data={chartData} />
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Absences</h3>
          <BarChart data={[{ name: 'Absences', value: stats.absences }]} color="#ef4444" />
        </div>
      </div>
    </div>
  );
}