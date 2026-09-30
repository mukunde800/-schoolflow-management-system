import { useEffect, useState } from 'react';
import { BookOpen, CalendarCheck, ClipboardList } from 'lucide-react';
import Card from '../../common/Card';
import { useAuth } from '../../../context/AuthContext';
import { studentService } from '../../service/studentService';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (user?.student?.id) {
      studentService.getGrades(user.student.id).then(setGrades).catch(() => {});
      studentService.getAttendance(user.student.id).then(setAttendance).catch(() => {});
    }
  }, [user]);

  const average = grades.length
    ? (grades.reduce((s, g) => s + parseFloat(g.value), 0) / grades.length).toFixed(2)
    : '—';

  const absences = attendance.filter((a) => a.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {user?.firstName} 👋</h1>
        <p className="text-sm text-gray-500">Votre espace étudiant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Moyenne générale" value={average} icon={<BookOpen size={22} />} color="primary" />
        <Card title="Notes" value={grades.length} icon={<ClipboardList size={22} />} color="green" />
        <Card title="Absences" value={absences} icon={<CalendarCheck size={22} />} color="red" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Dernières notes</h3>
        <div className="space-y-2">
          {grades.slice(0, 5).map((g) => (
            <div key={g.id} className="flex justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span>{g.subject?.name || 'Matière'}</span>
              <span className="font-semibold">{g.value}/20</span>
            </div>
          ))}
          {!grades.length && <p className="text-sm text-gray-500">Aucune note disponible</p>}
        </div>
      </div>
    </div>
  );
}