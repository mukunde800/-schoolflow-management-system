import { useState } from 'react';
import Button from '../../common/Button';
import BarChart from '../../charts/BarChart';
import PieChart from '../../charts/PieChart';
import api from '../../service/api';

export default function ReportsPage() {
  const [dist, setDist] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/dashboard/grade-distribution')
      .then(({ data }) => setDist(Object.entries(data).map(([name, value]) => ({ name, value }))))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Rapports</h1>
        <Button onClick={load} loading={loading}>Générer</Button>
      </div>

      {dist.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Répartition des notes</h3>
            <BarChart data={dist} />
          </div>
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Vue circulaire</h3>
            <PieChart data={dist} />
          </div>
        </div>
      )}
    </div>
  );
}