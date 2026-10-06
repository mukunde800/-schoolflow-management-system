import { useEffect, useState } from 'react';
import {
  User, Mail, Phone, Shield, Calendar, Save, Key, Eye, EyeOff,
  AlertTriangle, BarChart3, Users, GraduationCap, BookOpen,
  DollarSign, CalendarCheck, Briefcase
} from 'lucide-react';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';
import Badge from '../../common/Badge';
import Spinner from '../../common/Spiner';
import Modal from '../../common/Modal';
import ConfirmDialog from '../../common/ConfirmDialog';
import AvatarUpload from '../../common/AvatarUpload';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../service/userService';
import { formatDate } from '../../../utils/formatters';
import useToast from '../../hooks/useToast';

const ROLE_LABELS = {
  admin: 'Administrateur',
  teacher: 'Enseignant',
  student: 'Étudiant',
  parent: 'Parent',
};

const ROLE_COLORS = {
  admin: 'danger',
  teacher: 'info',
  student: 'success',
  parent: 'warning',
};

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Formulaires
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', avatar: null });
  const [initialForm, setInitialForm] = useState(null);
  const [errors, setErrors] = useState({});

  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' });
  const [pwdErrors, setPwdErrors] = useState({});
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false });
  const [isPwdModalOpen, setIsPwdModalOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  // ============ FETCH ============
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [p, s] = await Promise.all([
          userService.getProfile(),
          userService.getStats().catch(() => ({})),
        ]);
        setProfile(p);
        setStats(s);
        const f = {
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          phone: p.phone || '',
          avatar: p.avatar || null,
        };
        setForm(f);
        setInitialForm(f);
      } catch (err) {
        console.error(err);
        toast.error('Erreur de chargement du profil');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ PROFILE SAVE ============
  const validateProfile = () => {
    const e = {};
    if (!form.firstName?.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName?.trim()) e.lastName = 'Nom requis';
    if (form.phone && !/^[\d\s+\-()]{6,}$/.test(form.phone)) e.phone = 'Téléphone invalide';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    setSaving(true);
    try {
      const updated = await userService.updateProfile(form);
      setProfile(updated);
      setInitialForm(form);
      // Met à jour le contexte global
      setUser?.((prev) => ({ ...prev, ...updated }));
      toast.success('Profil mis à jour');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setForm(initialForm);
    setErrors({});
    toast.info('Modifications annulées');
  };

  // ============ PASSWORD CHANGE ============
  const validatePassword = () => {
    const e = {};
    if (!pwdForm.current) e.current = 'Mot de passe actuel requis';
    if (!pwdForm.next) e.next = 'Nouveau mot de passe requis';
    else if (pwdForm.next.length < 6) e.next = 'Minimum 6 caractères';
    if (pwdForm.next !== pwdForm.confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setPwdErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    setChangingPwd(true);
    try {
      await userService.changePassword({
        currentPassword: pwdForm.current,
        newPassword: pwdForm.next,
      });
      toast.success('Mot de passe modifié');
      setIsPwdModalOpen(false);
      setPwdForm({ current: '', next: '', confirm: '' });
      setPwdErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setChangingPwd(false);
    }
  };

  // ============ DEACTIVATE ============
  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await userService.deactivate();
      toast.success('Compte désactivé — déconnexion...');
      setTimeout(() => window.location.href = '/login', 1000);
    } catch (err) {
      toast.error('Erreur');
      setDeactivating(false);
    }
  };

  // ============ HELPERS ============
  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);
  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase();

  // ============ RENDER ============
  if (loading) return <Spinner fullScreen />;
  if (!profile) return <div className="text-center py-10 text-gray-500">Profil introuvable</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ============ HEADER ============ */}
      <div className="card overflow-hidden">
        {/* Bannière */}
        <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-800" />

        {/* Contenu */}
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-white dark:ring-gray-800 shadow-xl">
                    {initials}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
              </div>

              {/* Nom + email */}
              <div className="sm:pb-2">
                <h1 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                  <Mail size={14} />
                  {profile.email}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant={ROLE_COLORS[profile.role] || 'info'}>
                    <Shield size={10} className="inline mr-1" />
                    {ROLE_LABELS[profile.role] || profile.role}
                  </Badge>
                  {profile.isActive ? (
                    <Badge variant="success">Actif</Badge>
                  ) : (
                    <Badge variant="danger">Inactif</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton changer mdp */}
            <Button
              variant="secondary"
              icon={<Key size={16} />}
              onClick={() => setIsPwdModalOpen(true)}
              className="sm:mb-2"
            >
              Changer le mot de passe
            </Button>
          </div>
        </div>
      </div>

      {/* ============ STATISTIQUES ============ */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {profile.role === 'student' && (
            <>
              <Card title="Notes" value={stats.grades || 0} icon={<BarChart3 size={22} />} color="primary" />
              <Card title="Moyenne" value={`${stats.average || 0}/20`} icon={<GraduationCap size={22} />} color="green" />
              <Card title="Absences" value={stats.absences || 0} icon={<CalendarCheck size={22} />} color="red" />
              <Card title="Paiements" value={stats.payments || 0} icon={<DollarSign size={22} />} color="yellow" />
            </>
          )}
          {profile.role === 'teacher' && (
            <>
              <Card title="Classes" value={stats.classes || 0} icon={<BookOpen size={22} />} color="primary" />
              <Card title="Matières" value={stats.subjects || 0} icon={<Briefcase size={22} />} color="green" />
              <Card title="Notes données" value={stats.gradesGiven || 0} icon={<BarChart3 size={22} />} color="purple" />
            </>
          )}
          {profile.role === 'parent' && (
            <Card title="Mes enfants" value={stats.children || 0} icon={<Users size={22} />} color="primary" />
          )}
          {profile.role === 'admin' && (
            <>
              <Card title="Étudiants" value={stats.students || 0} icon={<Users size={22} />} color="primary" />
              <Card title="Enseignants" value={stats.teachers || 0} icon={<GraduationCap size={22} />} color="green" />
              <Card title="Classes" value={stats.classes || 0} icon={<BookOpen size={22} />} color="purple" />
            </>
          )}
        </div>
      )}

      {/* ============ LAYOUT 2 COLONNES ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar éditable */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold mb-4 text-center">Photo de profil</h3>
            <AvatarUpload
              value={form.avatar}
              onChange={(v) => setForm({ ...form, avatar: v })}
              firstName={profile.firstName}
              lastName={profile.lastName}
            />
          </div>
        </div>

        {/* Informations */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <User size={20} className="text-primary-600" />
              <h3 className="font-semibold">Informations personnelles</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Prénom *"
                value={form.firstName}
                error={errors.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
              <Input
                label="Nom *"
                value={form.lastName}
                error={errors.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>

            <Input
              label="Email"
              value={profile.email}
              disabled
              icon={<Mail size={16} />}
            />
            <p className="text-xs text-gray-500 -mt-3">
              L'email ne peut pas être modifié. Contactez un administrateur.
            </p>

            <Input
              label="Téléphone"
              value={form.phone}
              error={errors.phone}
              icon={<Phone size={16} />}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+257 79 00 00 00"
            />

            {/* Infos lecture seule selon rôle */}
            {profile.role === 'student' && profile.student && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Matricule</p>
                    <p className="font-mono text-sm">{profile.student.matricule}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Classe</p>
                    <p className="text-sm font-medium">{profile.student.class?.name || '—'}</p>
                  </div>
                </div>
              </>
            )}

            {profile.role === 'teacher' && profile.teacher && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-xs text-gray-500">Matricule employé</p>
                  <p className="font-mono text-sm">{profile.teacher.employeeId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spécialité</p>
                  <p className="text-sm font-medium">{profile.teacher.specialization || '—'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t flex-wrap">
              {hasChanges && (
                <Button variant="ghost" onClick={handleDiscard}>
                  Annuler
                </Button>
              )}
              <Button
                icon={<Save size={16} />}
                onClick={handleSaveProfile}
                loading={saving}
                disabled={!hasChanges}
              >
                Enregistrer les modifications
              </Button>
            </div>
          </div>

          {/* ============ INFOS COMPTE ============ */}
          <div className="card p-6 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Shield size={20} className="text-primary-600" />
              <h3 className="font-semibold">Informations du compte</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500">ID utilisateur</p>
                <p className="font-mono text-xs truncate">{profile.id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Rôle</p>
                <Badge variant={ROLE_COLORS[profile.role]}>
                  {ROLE_LABELS[profile.role]}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-gray-500">Créé le</p>
                <p className="flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(profile.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Dernière connexion</p>
                <p>{profile.lastLogin ? new Date(profile.lastLogin).toLocaleString('fr-FR') : '—'}</p>
              </div>
            </div>
          </div>

          {/* ============ DANGER ZONE ============ */}
          <div className="card p-6 border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={20} className="text-red-500" />
              <h3 className="font-semibold text-red-600">Zone dangereuse</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              La désactivation de votre compte vous empêchera de vous connecter. Un administrateur
              devra le réactiver manuellement.
            </p>
            <Button
              variant="danger"
              onClick={() => setIsDeactivateOpen(true)}
            >
              Désactiver mon compte
            </Button>
          </div>
        </div>
      </div>

      {/* ============ MODAL : CHANGEMENT MOT DE PASSE ============ */}
      <Modal
        isOpen={isPwdModalOpen}
        onClose={() => setIsPwdModalOpen(false)}
        title="Changer le mot de passe"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Mot de passe actuel *"
            type={showPwd.current ? 'text' : 'password'}
            value={pwdForm.current}
            error={pwdErrors.current}
            onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
            icon={
              <button
                type="button"
                onClick={() => setShowPwd({ ...showPwd, current: !showPwd.current })}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Nouveau mot de passe *"
            type={showPwd.next ? 'text' : 'password'}
            value={pwdForm.next}
            error={pwdErrors.next}
            onChange={(e) => setPwdForm({ ...pwdForm, next: e.target.value })}
            icon={
              <button
                type="button"
                onClick={() => setShowPwd({ ...showPwd, next: !showPwd.next })}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPwd.next ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <Input
            label="Confirmer le nouveau mot de passe *"
            type={showPwd.confirm ? 'text' : 'password'}
            value={pwdForm.confirm}
            error={pwdErrors.confirm}
            onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
            icon={
              <button
                type="button"
                onClick={() => setShowPwd({ ...showPwd, confirm: !showPwd.confirm })}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPwd.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-xs text-blue-800 dark:text-blue-200">
            💡 Le mot de passe doit contenir au moins 6 caractères.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="secondary" onClick={() => setIsPwdModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleChangePassword} loading={changingPwd}>
              Modifier
            </Button>
          </div>
        </div>
      </Modal>

      {/* ============ CONFIRM : DÉSACTIVATION ============ */}
      <ConfirmDialog
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={handleDeactivate}
        title="Désactiver votre compte"
        message="Voulez-vous vraiment désactiver votre compte ? Vous serez déconnecté et ne pourrez plus vous reconnecter."
        loading={deactivating}
      />
    </div>
  );
}