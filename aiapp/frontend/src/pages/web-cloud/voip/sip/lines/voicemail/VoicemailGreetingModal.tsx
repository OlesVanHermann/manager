// ============================================================
// VOICEMAIL GREETING MODAL - Upload d'annonce vocale
// ============================================================

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { modalsService } from './modals.service';
import './modals.css';

interface Props {
  billingAccount: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type GreetingType = 'unavailable' | 'busy' | 'temp';

export function VoicemailGreetingModal({ billingAccount, serviceName, isOpen, onClose, onSuccess }: Props) {
  const { t } = useTranslation('web-cloud/voip/modals');
  const [greetingType, setGreetingType] = useState<GreetingType>('unavailable');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError(t('greeting.invalidFormat'));
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError(t('greeting.fileTooLarge'));
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      await modalsService.uploadVoicemailGreeting(billingAccount, serviceName, file, greetingType);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    onClose();
  };

  return (
    <div className="voip-modal-overlay" onClick={handleClose}>
      <div className="voip-modal" onClick={e => e.stopPropagation()}>
        <div className="voip-modal-header">
          <h3>{t('greeting.title')}</h3>
          <button className="voip-modal-close" onClick={handleClose}>✕</button>
        </div>

        <div className="voip-modal-body">
          <div className="voip-modal-info">
            <span className="voip-modal-info-icon">🎙️</span>
            <p>{t('greeting.info')}</p>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('greeting.type')}</label>
            <select
              className="voip-form-select"
              value={greetingType}
              onChange={e => setGreetingType(e.target.value as GreetingType)}
            >
              <option value="unavailable">{t('greeting.types.unavailable')}</option>
              <option value="busy">{t('greeting.types.busy')}</option>
              <option value="temp">{t('greeting.types.temp')}</option>
            </select>
          </div>

          <div className="voip-form-group">
            <label className="voip-form-label">{t('greeting.file')}</label>
            <div
              className={`voip-upload-zone ${dragActive ? 'active' : ''}`}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/wav,audio/mp3,audio/mpeg,audio/ogg"
                onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              {file ? (
                <>
                  <span className="voip-upload-icon">✅</span>
                  <span className="voip-upload-text">{file.name}</span>
                </>
              ) : (
                <>
                  <span className="voip-upload-icon">📁</span>
                  <span className="voip-upload-text">{t('greeting.dropzone')}</span>
                </>
              )}
            </div>
            <p className="voip-form-hint">{t('greeting.fileHint')}</p>
          </div>

          {error && <p className="voip-form-error">{error}</p>}
        </div>

        <div className="voip-modal-footer">
          <button className="voip-btn-cancel" onClick={handleClose}>
            {t('common.cancel')}
          </button>
          <button
            className="voip-btn-confirm"
            onClick={handleSubmit}
            disabled={loading || !file}
          >
            {loading ? t('common.uploading') : t('common.upload')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoicemailGreetingModal;
