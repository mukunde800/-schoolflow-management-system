import { useState } from 'react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useTheme } from '../../../context/ThemeContext';
import useToast from '../../hooks/useToast';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const toast = useToast();
  const [form, setForm] = useState({ schoolName: 'SchoolFlow', academicYear: '2024-2025', address: '' });

  const handleSave = () => toast.success('Paramètres enregistrés');

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold">Informations de l'établissement</h3>
        <Input label="Nom de l'école" value={form.schoolName} onChange={(e) => setForm({ ...form, schoolName: e.target.value })} />
        <Input label="Année scolaire" value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
        <Input label="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Thème</h3>
          <p className="text-sm text-gray-500">Basculer entre mode clair et sombre</p>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          Mode {theme === 'dark' ? 'clair' : 'sombre'}
        </Button>
      </div>
    </div>
  );
}