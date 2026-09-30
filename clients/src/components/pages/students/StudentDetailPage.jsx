import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, Calendar, BookOpen } from 'lucide-react';
import Badge from '../../common/Badge';
import Spinner from '../../common/Spiner';
import { studentService } from '../../service/studentService';
import { formatDate } from '../../../utils/formatters';

export default function StudentDetailPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => { studentService.getById(id).then(setStudent); }, [id]);

  if (!student) return <Spinner fullScreen />;

  return (
    <div className="space-y-6">
      <div className="card p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
          {student.user?.firstName?.[0]}{student.user?.lastName?.[0]}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{student.user?.firstName} {student.user?.lastName}</h1>
          <p className="text-sm text-gray-500">Matricule : {student.matricule}</p>
          <Badge variant={student.status === 'active' ? 'success' : 'default'}>{student.status}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card p-6 space-y-3">
          <h3 className="font-semibold">Informations</h3>
          <p className="flex items-center gap-2 text-sm"><Mail size={16} /> {student.user?.email}</p>
          <p className="flex items-center gap-2 text-sm"><Phone size={16} /> {student.user?.phone || '—'}</p>
          <p className="flex items-center gap-2 text-sm"><Calendar size={16} /> Né(e) le {formatDate(student.birthDate)}</p>
          <p className="flex items-center gap-2 text-sm"><BookOpen size={16} /> {student.class?.name || 'Sans classe'}</p>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-3">Notes récentes</h3>
          <div className="space-y-2">
            {student.grades?.slice(0, 5).map((g) => (
              <div key={g.id} className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-700/50 text-sm">
                <span>Note</span><span className="font-medium">{g.value}/20</span>
              </div>
            ))}
            {!student.grades?.length && <p className="text-sm text-gray-500">Aucune note</p>}
          </div>
        </div>
      </div>
    </div>
  );
}