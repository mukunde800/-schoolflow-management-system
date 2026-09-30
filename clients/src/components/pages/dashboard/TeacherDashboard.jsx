import { useEffect, useState } from 'react';
import { Users, BookOpen, ClipboardList } from 'lucide-react';
import Card from '../../common/Card';
import { useAuth } from '../../../context/AuthContext';
import { classService } from '../../service/classService';
import { gradeService } from '../../service/gradeService';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    classService.getAll().then(setClasses).catch(() => {});
    gradeService.getAll().then(setGrades).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour {user?.firstName} 👋</h1>
        <p className="text-sm text-gray-500">Votre espace enseignant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="Mes classes" value={classes.length} icon={<BookOpen size={22} />} color="primary" />
        <Card title="Notes saisies" value={grades.length} icon={<ClipboardList size={22} />} color="green" />
        <Card title="Étudiants" value={classes.reduce((s, c) => s + (c.students?.length || 0), 0)} icon={<Users size={22} />} color="purple" />
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Mes classes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((c) => (
            <div key={c.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="font-medium">{c.name}</h4>
              <p className="text-sm text-gray-500">{c.students?.length || 0} étudiants</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}