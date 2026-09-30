import { useEffect, useState } from 'react';
import api from '../../service/api';
import Spinner from '../../common/Spiner';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_LABELS = { monday: 'Lundi', tuesday: 'Mardi', wednesday: 'Mercredi', thursday: 'Jeudi', friday: 'Vendredi', saturday: 'Samedi' };

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/schedules').then(({ data }) => setSchedules(data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullScreen />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Emploi du temps</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {DAYS.map((day) => (
          <div key={day} className="card p-4">
            <h3 className="font-semibold text-sm mb-3">{DAY_LABELS[day]}</h3>
            <div className="space-y-2">
              {schedules.filter((s) => s.dayOfWeek === day).map((s) => (
                <div key={s.id} className="p-2 rounded bg-primary-50 dark:bg-primary-900/20 text-xs">
                  <p className="font-medium">{s.subject?.name}</p>
                  <p className="text-gray-500">{s.startTime} - {s.endTime}</p>
                </div>
              ))}
              {!schedules.filter((s) => s.dayOfWeek === day).length && (
                <p className="text-xs text-gray-400">Libre</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}