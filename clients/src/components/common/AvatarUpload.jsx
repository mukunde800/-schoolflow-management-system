import { useRef, useState } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import Button from './Button';
import useToast from '../hooks/useToast';

const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function AvatarUpload({ value, onChange, firstName, lastName }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);

  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'U';

  const handleFile = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Format accepté : JPG, PNG, WebP');
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error('Fichier trop volumineux (max 2 Mo)');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setPreview(base64);
      onChange?.(base64);
      setUploading(false);
    };
    reader.onerror = () => {
      toast.error('Erreur de lecture du fichier');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative group"
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover ring-4 ring-primary-100 dark:ring-primary-900/30 shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center text-4xl font-bold ring-4 ring-primary-100 dark:ring-primary-900/30 shadow-lg">
            {initials}
          </div>
        )}

        {/* Overlay au survol */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
        >
          <Camera size={28} />
        </button>

        {/* Bouton supprimer */}
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600 transition-colors"
            aria-label="Supprimer l'avatar"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      <div className="text-center">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={<Upload size={14} />}
          onClick={() => inputRef.current?.click()}
          loading={uploading}
        >
          Changer la photo
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          JPG, PNG ou WebP — max 2 Mo
        </p>
      </div>
    </div>
  );
}