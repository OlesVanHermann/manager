// ============================================================
// WORDPRESS MODAL: RESTORE BACKUP
// ============================================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { WordPressBackup, RestoreOptions } from '../wordpress.types';
import './Modals.css';

interface Props {
  isOpen: boolean;
  backup: WordPressBackup | null;
  onClose: () => void;
  onConfirm: (options: RestoreOptions) => Promise<void>;
}

export function RestoreBackupModal({ isOpen, backup, onClose, onConfirm }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [options, setOptions] = useState<RestoreOptions>({
    files: true,
    database: true,
    configuration: false,
  });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !backup) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;

    setLoading(true);
    try {
      await onConfirm(options);
    } finally {
      setLoading(false);
      setConfirmed(false);
      setOptions({ files: true, database: true, configuration: false });
    }
  };

  const handleClose = () => {
    setConfirmed(false);
    setOptions({ files: true, database: true, configuration: false });
    onClose();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t('restore.modal.title')}</h3>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Backup Info */}
            <div className="restore-backup-info">
              <div className="restore-backup-row">
                <span className="restore-backup-label">{t('restore.modal.date')}</span>
                <span className="restore-backup-value">{formatDate(backup.date)}</span>
              </div>
              <div className="restore-backup-row">
                <span className="restore-backup-label">{t('restore.modal.type')}</span>
                <span className="restore-backup-value">
                  {backup.type === 'automatic' ? t('backups.typeAutomatic') : t('backups.typeManual')}
                </span>
              </div>
              <div className="restore-backup-row">
                <span className="restore-backup-label">{t('restore.modal.size')}</span>
                <span className="restore-backup-value">{formatSize(backup.size)}</span>
              </div>
            </div>

            {/* Restore Options */}
            <div className="form-group">
              <label className="restore-options-label">{t('restore.modal.optionsLabel')}</label>
              <div className="restore-options">
                <label className="restore-option">
                  <input
                    type="checkbox"
                    checked={options.files}
                    onChange={e => setOptions(prev => ({ ...prev, files: e.target.checked }))}
                  />
                  <div className="restore-option-content">
                    <strong>{t('restore.modal.files')}</strong>
                    <span>{t('restore.modal.filesDesc')}</span>
                  </div>
                </label>
                <label className="restore-option">
                  <input
                    type="checkbox"
                    checked={options.database}
                    onChange={e => setOptions(prev => ({ ...prev, database: e.target.checked }))}
                  />
                  <div className="restore-option-content">
                    <strong>{t('restore.modal.database')}</strong>
                    <span>{t('restore.modal.databaseDesc')}</span>
                  </div>
                </label>
                <label className="restore-option">
                  <input
                    type="checkbox"
                    checked={options.configuration}
                    onChange={e => setOptions(prev => ({ ...prev, configuration: e.target.checked }))}
                  />
                  <div className="restore-option-content">
                    <strong>{t('restore.modal.configuration')}</strong>
                    <span>{t('restore.modal.configurationDesc')}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning */}
            <div className="modal-warning">
              <span className="modal-warning-icon">⚠️</span>
              <div>
                <strong>{t('restore.modal.warning')}</strong>
                <p>{t('restore.modal.warningText')}</p>
              </div>
            </div>

            {/* Confirmation */}
            <label className="restore-confirm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
              />
              <span>{t('restore.modal.confirm')}</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-danger"
              disabled={loading || !confirmed || (!options.files && !options.database)}
            >
              {loading ? '...' : t('restore.modal.restore')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RestoreBackupModal;
