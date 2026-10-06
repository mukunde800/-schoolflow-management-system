import { useEffect, useState } from 'react';
import {
  Save, RotateCcw, Moon, Sun, Monitor, School, User, Bell, Shield,
} from 'lucide-react';
import Input from '../../common/Input';
import Button from '../../common/Button';
import Select from '../../common/Select';
import Spinner from '../../common/Spiner';
import Badge from '../../common/Badge';
import ConfirmDialog from '../../common/ConfirmDialog';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { settingService } from '../../service/settingService';
import useToast from '../../hooks/useToast';

const DEFAULT_SETTINGS = {
  schoolName: 'SchoolFlow',
  academicYear: '2024-2025',
  address: '',
  phone: '',
  email: '',
  city: '',
  country: 'Burundi',
  language: 'fr',
};

export default function SettingsPage() {
  const { theme, toggleTheme, setLight, setDark } = useTheme();
  const { user } = useAuth();
  const toast = useToast();

  // ============ STATE ============
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [initialForm, setInitialForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState('general');

  // ============ FETCH ============
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await settingService.getAll();
        const merged = { ...DEFAULT_SETTINGS, ...data };
        setForm(merged);
        setInitialForm(merged);
      } catch (err) {
        console.error(err);
        toast.error('Erreur de chargement des paramètres');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ VALIDATION ============
  const validate = () => {
    const e = {};
    if (!form.schoolName?.trim()) e.schoolName = 'Nom de l\'école requis';
    if (!form.academicYear?.trim()) e.academicYear = 'Année scolaire requise';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Email invalide';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ============ SAVE ============
  const handleSave = async () => {
    if (!validate()) {
      toast.error('Vérifiez les champs en rouge');
      return;
    }

    setSaving(true);
    try {
      await settingService.save(form);
      setInitialForm(form);
      toast.success('Paramètres enregistrés avec succès');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  // ============ RESET ============
  const handleReset = async () => {
    setResetting(true);
    try {
      await settingService.reset();
      setForm(DEFAULT_SETTINGS);
      setInitialForm(DEFAULT_SETTINGS);
      toast.success('Paramètres réinitialisés');
      setIsResetOpen(false);
    } catch (err) {
      toast.error('Erreur lors de la réinitialisation');
    } finally {
      setResetting(false);
    }
  };

  // ============ DISCARD ============
  const handleDiscard = () => {
    setForm(initialForm);
    setErrors({});
    toast.info('Modifications annulées');
  };

  // ============ HAS CHANGES ============
  const hasChanges = JSON.stringify(form) !== JSON.stringify(initialForm);

  // ============ RENDER ============
  if (loading) return <Spinner fullScreen />;

  const SECTIONS = [
    { id: 'general', label: 'Général', icon: School },
    { id: 'appearance', label: 'Apparence', icon: Sun },
    { id: 'account', label: 'Mon compte', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-sm text-gray-500">
            Configuration du système et de votre compte
          </p>
        </div>
        {hasChanges && (
          <Badge variant="warning">
            Modifications non enregistrées
          </Badge>
        )}
      </div>

      {/* Layout 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menu latéral */}
        <aside className="lg:col-span-1">
          <nav className="card p-2 space-y-1 lg:sticky lg:top-4">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors text-left
                  ${
                    activeSection === id
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Contenu */}
        <div className="lg:col-span-3 space-y-6">
          {/* ============ SECTION : GENERAL ============ */}
          {activeSection === 'general' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <School size={20} className="text-primary-600" />
                <h3 className="font-semibold">Informations de l'établissement</h3>
              </div>

              <Input
                label="Nom de l'école *"
                value={form.schoolName}
                error={errors.schoolName}
                onChange={(e) => setForm({ ...form, schoolName: e.target.value })}
                placeholder="Ex: Complexe Scolaire Les Étoiles"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Année scolaire *"
                  value={form.academicYear}
                  error={errors.academicYear}
                  onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
                  placeholder="2024-2025"
                />
                <Input
                  label="Téléphone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+257 79 00 00 00"
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contact@ecole.com"
              />

              <Input
                label="Adresse"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Avenue de l'École"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Ville"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Bujumbura"
                />
                <Input
                  label="Pays"
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  placeholder="Burundi"
                />
              </div>

              <Select
                label="Langue par défaut"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                options={[
                  { value: 'fr', label: 'Français' },
                  { value: 'en', label: 'English' },
                  { value: 'ki', label: 'Kirundi' },
                  { value: 'sw', label: 'Kiswahili' },
                ]}
              />
            </div>
          )}

          {/* ============ SECTION : APPEARANCE ============ */}
          {activeSection === 'appearance' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sun size={20} className="text-primary-600" />
                <h3 className="font-semibold">Apparence</h3>
              </div>

              <p className="text-sm text-gray-500">
                Personnalisez l'apparence de l'interface
              </p>

              <div className="grid grid-cols-3 gap-3">
                {/* Light */}
                <button
                  onClick={setLight}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-center
                    ${
                      theme === 'light'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Sun size={24} className="mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm font-medium">Clair</p>
                  {theme === 'light' && (
                    <Badge variant="success" className="mt-2">
                      Actif
                    </Badge>
                  )}
                </button>

                {/* Dark */}
                <button
                  onClick={setDark}
                  className={`
                    p-4 rounded-lg border-2 transition-all text-center
                    ${
                      theme === 'dark'
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Moon size={24} className="mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-medium">Sombre</p>
                  {theme === 'dark' && (
                    <Badge variant="success" className="mt-2">
                      Actif
                    </Badge>
                  )}
                </button>

                {/* Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all text-center"
                >
                  <Monitor size={24} className="mx-auto mb-2 text-gray-500" />
                  <p className="text-sm font-medium">Basculer</p>
                </button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Thème actuel : <strong>{theme === 'dark' ? 'Sombre' : 'Clair'}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Le thème est sauvegardé automatiquement dans votre navigateur.
                </p>
              </div>
            </div>
          )}

          {/* ============ SECTION : ACCOUNT ============ */}
          {activeSection === 'account' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={20} className="text-primary-600" />
                <h3 className="font-semibold">Mon compte</h3>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-xl font-bold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge variant="info" className="mt-1">
                    {user?.role}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">ID utilisateur</p>
                  <p className="font-mono text-xs truncate">{user?.id}</p>
                </div>
                <div>
                  <p className="text-gray-500">Dernière connexion</p>
                  <p>{user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : '—'}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 pt-2 border-t">
                Pour modifier vos informations personnelles, contactez un administrateur.
              </p>
            </div>
          )}

          {/* ============ SECTION : NOTIFICATIONS ============ */}
          {activeSection === 'notifications' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={20} className="text-primary-600" />
                <h3 className="font-semibold">Notifications</h3>
              </div>

              {[
                { key: 'emailNotif', label: 'Notifications par email', desc: 'Recevoir un email à chaque événement important' },
                { key: 'pushNotif', label: 'Notifications push', desc: 'Notifications dans le navigateur' },
                { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé chaque lundi' },
                { key: 'paymentReminders', label: 'Rappels de paiement', desc: 'Notifications pour les paiements en retard' },
              ].map(({ key, label, desc }) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form[key] ?? false}
                    onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                    className="w-5 h-5 rounded accent-primary-600"
                  />
                </label>
              ))}
            </div>
          )}

          {/* ============ SECTION : SECURITY ============ */}
          {activeSection === 'security' && (
            <div className="card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={20} className="text-primary-600" />
                <h3 className="font-semibold">Sécurité</h3>
              </div>

              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  🔒 Pour changer votre mot de passe, rendez-vous dans la section « Mon compte » ou contactez un administrateur.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium">Dernières actions de sécurité</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Dernière connexion : {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : '—'}</p>
                  <p>• Rôle : <Badge variant="info">{user?.role}</Badge></p>
                  <p>• Statut du compte : <Badge variant={user?.isActive ? 'success' : 'danger'}>{user?.isActive ? 'Actif' : 'Inactif'}</Badge></p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {['general'].includes(activeSection) && (
            <div className="card p-4 flex justify-between items-center flex-wrap gap-3">
              <Button
                variant="secondary"
                icon={<RotateCcw size={16} />}
                onClick={() => setIsResetOpen(true)}
              >
                Réinitialiser
              </Button>

              <div className="flex gap-2">
                {hasChanges && (
                  <Button variant="ghost" onClick={handleDiscard}>
                    Annuler
                  </Button>
                )}
                <Button
                  icon={<Save size={16} />}
                  loading={saving}
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm reset */}
      <ConfirmDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleReset}
        title="Réinitialiser les paramètres"
        message="Voulez-vous vraiment réinitialiser tous les paramètres ? Cette action est irréversible."
        loading={resetting}
      />
    </div>
  );
}