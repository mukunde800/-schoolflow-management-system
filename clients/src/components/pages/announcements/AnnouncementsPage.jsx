import { useEffect, useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import api from '../../service/api';
import { formatDate } from '../../../utils/formatters';

export default function AnnouncementsPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/announcements').then(({ data }) => setItems(data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Annonces</h1>
        <Button icon={<Plus size={16} />}>Nouvelle annonce</Button>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600"><Megaphone size={20} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  <Badge variant={a.priority === 'high' ? 'danger' : 'info'}>{a.priority}</Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{a.content}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(a.publishedAt)}</p>
              </div>
            </div>
          </div>
        ))}
        {!items.length && <p className="text-center text-gray-500 py-10">Aucune annonce</p>}
      </div>
    </div>
  );
}