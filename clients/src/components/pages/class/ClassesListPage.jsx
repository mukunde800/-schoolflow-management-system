import { useEffect, useState } from 'react';
import { Plus, BookOpen } from 'lucide-react';
import Button from '../../common/Button';
import Spinner from '../../common/Spiner';
import { classService } from '../../service/classService';

export default function ClassesListPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    classService.getAll().then(setClasses).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner fullScreen />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Button icon={<Plus size={16} />}>Nouvelle classe</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((c) => (
          <div key={c.id} className="card p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600"><BookOpen size={20} /></div>
              <div className="flex-1">
                <h3 className="font-semibold">{c.name}</h3>
                <p className="text-xs text-gray-500">{c.level} — {c.academicYear}</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span>{c.students?.length || 0} étudiants</span>
                  <span className="text-gray-500">Cap. {c.capacity}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {!classes.length && <p className="text-gray-500 col-span-full text-center py-10">Aucune classe</p>}
      </div>
    </div>
  );
}