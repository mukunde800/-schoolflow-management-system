import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import { authService } from '../../service/authService';
import useToast from '../../hooks/useToast';

export default function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', role: 'student',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.register(form);
      toast.success('Compte créé avec succès');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Inscription</h2>
      <p className="text-sm text-gray-500 mb-6">Créez votre compte</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Prénom" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input label="Nom" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        </div>
        <Input label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Mot de passe" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <Select label="Rôle" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          options={[
            { value: 'student', label: 'Étudiant' },
            { value: 'teacher', label: 'Enseignant' },
            { value: 'parent', label: 'Parent' },
          ]}
        />
        <Button type="submit" loading={loading} className="w-full">Créer un compte</Button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">
        Déjà un compte ? <Link to="/login" className="text-primary-600 font-medium">Se connecter</Link>
      </p>
    </div>
  );
}