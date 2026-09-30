import { Outlet } from 'react-router-dom';
import { School } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <School size={32} className="text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white">SchoolFlow</h1>
          <p className="text-primary-100 mt-1">Système de Gestion Scolaire</p>
        </div>
        <div className="card p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}