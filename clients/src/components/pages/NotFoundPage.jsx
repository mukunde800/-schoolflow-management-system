import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary-600">404</h1>
        <p className="text-xl mt-2 mb-6 text-gray-500">Page introuvable</p>
        <Link to="/dashboard"><Button>Retour au tableau de bord</Button></Link>
      </div>
    </div>
  );
}