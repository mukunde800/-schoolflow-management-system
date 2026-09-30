import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useAuth } from '../../../context/AuthContext';
import useToast from '../../hooks/useToast';

export default function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Connexion réussie');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Connexion</h2>
      <p className="text-sm text-gray-500 mb-6">Accédez à votre espace</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email" type="email" icon={<Mail size={16} />} required
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Mot de passe" type="password" icon={<Lock size={16} />} required
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <Button type="submit" loading={loading} className="w-full">Se connecter</Button>
      </form>

      <p className="text-center text-sm mt-4 text-gray-500">
        Pas de compte ? <Link to="/register" className="text-primary-600 font-medium">S'inscrire</Link>
      </p>
    </div>
  );
}