// ============================================================
// FAX LOGO TAB - Gestion du logo/en-tête fax
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { logoService } from './LogoTab.service';
import './LogoTab.css';

interface Props {
  serviceName: string;
}

interface FaxLogo {
  id: string;
  name: string;
  size: number;
  url: string;
  uploadDate: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export function LogoTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/telecom/fax/logo');
  const [logo, setLogo] = useState<FaxLogo | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [logoData, preview] = await Promise.all([
          logoService.getLogo(serviceName),
          logoService.getLogoPreview(serviceName),
        ]);
        setLogo(logoData);
        setPreviewUrl(preview);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
      alert(t('errors.invalidType'));
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      alert(t('errors.tooLarge'));
      return;
    }

    try {
      setUploading(true);
      const newLogo = await logoService.uploadLogo(serviceName, file);
      setLogo(newLogo);
      const preview = await logoService.getLogoPreview(serviceName);
      setPreviewUrl(preview);
    } catch {
      alert(t('errors.uploadFailed'));
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDelete = async () => {
    if (!confirm(t('confirmDelete'))) return;

    try {
      await logoService.deleteLogo(serviceName);
      setLogo(null);
      setPreviewUrl('');
    } catch {
      alert(t('errors.deleteFailed'));
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="fax-logo-loading">
        <div className="fax-logo-skeleton" />
      </div>
    );
  }

  return (
    <div className="fax-logo-tab">
      {/* ---------- INFO BANNER ---------- */}
      <div className="logo-info-banner">
        <span className="logo-info-icon">ℹ️</span>
        <p>{t('infoBanner')}</p>
      </div>

      {/* ---------- UPLOAD ZONE ---------- */}
      <div
        className={`logo-upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/tiff"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div className="upload-progress">
            <div className="upload-spinner" />
            <p>{t('uploading')}</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p className="upload-text">{t('dropzone.text')}</p>
            <button className="btn btn-secondary" onClick={handleBrowseClick}>
              {t('dropzone.browse')}
            </button>
            <p className="upload-hint">{t('dropzone.hint')}</p>
          </>
        )}
      </div>

      {/* ---------- CURRENT LOGO ---------- */}
      {logo && (
        <div className="logo-current">
          <h3 className="logo-section-title">{t('currentLogo')}</h3>
          <div className="logo-card">
            {previewUrl && (
              <div className="logo-preview">
                <img src={previewUrl} alt={t('logoPreview')} />
              </div>
            )}
            <div className="logo-info">
              <p className="logo-name">{logo.name}</p>
              <p className="logo-meta">
                {formatFileSize(logo.size)} • {formatDate(logo.uploadDate)}
              </p>
            </div>
            <div className="logo-actions">
              <button className="btn btn-danger" onClick={handleDelete}>
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- REQUIREMENTS ---------- */}
      <div className="logo-requirements">
        <h3 className="logo-section-title">{t('requirements.title')}</h3>
        <ul className="requirements-list">
          <li>{t('requirements.format')}</li>
          <li>{t('requirements.size')}</li>
          <li>{t('requirements.dimensions')}</li>
        </ul>
      </div>
    </div>
  );
}

export default LogoTab;
