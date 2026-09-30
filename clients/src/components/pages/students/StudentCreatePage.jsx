import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../common/Input';
import Select from '../../common/Select';
import Button from '../../common/Button';
import { studentService } from '../../service/studentService';
import useToast from '../../hooks/useToast';

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    matricule: '', birthDate: '', gender: 'M', address: '', status: 'active',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await studentService.create(form);
      toast.success('Étudiant créé');
      navigate('/students');
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nouvel étudiant</h1>
        <p className="text-sm text-gray-500">Créer un profil étudiant</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Matricule" required value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          <Input label="Date de naissance" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
          <Select label="Genre" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
            options={[{ value: 'M', label: 'Masculin' }, { value: 'F', label: 'Féminin' }]}
          />
          <Select label="Statut" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={[
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
              { value: 'graduated', label: 'Diplômé' },
            ]}
          />
        </div>
        <Input label="Adresse" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Annuler</Button>
          <Button type="submit" loading={loading}>Créer</Button>
        </div>
      </form>
    </div>
  );
}