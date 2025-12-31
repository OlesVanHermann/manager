// ============================================================
// WORDPRESS TAB: BACKUPS
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { backupsService } from './BackupsTab.service';
import type { WordPressBackup, RestoreOptions } from '../wordpress.types';
import RestoreBackupModal from '../RestoreBackupModal';
import './BackupsTab.css';

interface Props {
  serviceName: string;
}

interface StorageInfo {
  used: number;
  total: number;
  unit: string;
}

export function BackupsTab({ serviceName }: Props) {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const [backups, setBackups] = useState<WordPressBackup[]>([]);
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<WordPressBackup | null>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [backupsData, storage] = await Promise.all([
        backupsService.listBackups(serviceName),
        backupsService.getStorageInfo(serviceName).catch(() => null),
      ]);
      setBackups(backupsData || []);
      setStorageInfo(storage);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      await backupsService.createBackup(serviceName);
      alert(t('backups.createSuccess'));
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setCreating(false);
    }
  };

  const handleRestoreClick = (backup: WordPressBackup) => {
    setSelectedBackup(backup);
    setShowRestoreModal(true);
  };

  const handleRestoreConfirm = async (options: RestoreOptions) => {
    if (!selectedBackup) return;
    try {
      await backupsService.restoreBackup(serviceName, selectedBackup.id, options);
      alert(t('backups.restoreStarted'));
      setShowRestoreModal(false);
      setSelectedBackup(null);
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
  };

  const handleDelete = async (backupId: string) => {
    if (!confirm(t('backups.confirmDelete'))) return;
    try {
      await backupsService.deleteBackup(serviceName, backupId);
      loadData();
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
  };

  const handleDownload = async (backup: WordPressBackup) => {
    try {
      const url = await backupsService.getDownloadUrl(serviceName, backup.id);
      window.open(url, '_blank');
    } catch (err) {
      alert(`Erreur: ${err}`);
    }
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; label: string }> = {
      completed: { className: 'backups-badge backups-badge-success', label: t('backups.statusCompleted') },
      in_progress: { className: 'backups-badge backups-badge-warning', label: t('backups.statusInProgress') },
      failed: { className: 'backups-badge backups-badge-error', label: t('backups.statusFailed') },
    };
    return statusMap[status] || { className: 'backups-badge', label: status };
  };

  const storagePercentage = storageInfo ? Math.round((storageInfo.used / storageInfo.total) * 100) : 0;

  if (loading) {
    return <div className="backups-loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="backups-error">
        <p>{error}</p>
        <button className="backups-btn backups-btn-outline backups-btn-sm" onClick={loadData}>
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="backups-tab">
      {/* Header */}
      <div className="backups-header">
        <div>
          <h3>{t('backups.title')}</h3>
          <p className="backups-description">{t('backups.description')}</p>
        </div>
        <div className="backups-actions">
          <button
            className="backups-btn backups-btn-primary"
            onClick={handleCreateBackup}
            disabled={creating}
          >
            {creating ? '...' : `+ ${t('backups.create')}`}
          </button>
        </div>
      </div>

      {/* Storage Info */}
      {storageInfo && (
        <div className="backups-storage">
          <div className="backups-storage-header">
            <span className="backups-storage-label">{t('backups.storageUsed')}</span>
            <span className="backups-storage-value">
              {storageInfo.used} / {storageInfo.total} {storageInfo.unit}
            </span>
          </div>
          <div className="backups-storage-bar">
            <div
              className="backups-storage-fill"
              style={{
                width: `${storagePercentage}%`,
                backgroundColor: storagePercentage > 80 ? '#F59E0B' : '#10B981',
              }}
            />
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="backups-info">
        <span className="backups-info-icon">ℹ️</span>
        <p>{t('backups.info')}</p>
      </div>

      {/* Backups List */}
      {backups.length === 0 ? (
        <div className="backups-empty">
          <span className="backups-empty-icon">💾</span>
          <h4>{t('backups.empty')}</h4>
          <p>{t('backups.emptyHint')}</p>
          <button
            className="backups-btn backups-btn-primary"
            onClick={handleCreateBackup}
            disabled={creating}
          >
            {creating ? '...' : `+ ${t('backups.create')}`}
          </button>
        </div>
      ) : (
        <div className="backups-list">
          <table className="backups-table">
            <thead>
              <tr>
                <th>{t('backups.date')}</th>
                <th>{t('backups.type')}</th>
                <th>{t('backups.size')}</th>
                <th>{t('backups.status')}</th>
                <th>{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {backups.map(backup => {
                const status = getStatusBadge(backup.status);
                return (
                  <tr key={backup.id}>
                    <td>
                      <div className="backups-date">
                        <span className="backups-date-main">{formatDate(backup.date)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`backups-badge ${backup.type === 'automatic' ? 'backups-badge-info' : 'backups-badge-secondary'}`}>
                        {backup.type === 'automatic' ? t('backups.typeAutomatic') : t('backups.typeManual')}
                      </span>
                    </td>
                    <td>{formatSize(backup.size)}</td>
                    <td>
                      <span className={status.className}>{status.label}</span>
                    </td>
                    <td>
                      <div className="backups-row-actions">
                        <button
                          className="backups-btn backups-btn-xs backups-btn-primary"
                          onClick={() => handleRestoreClick(backup)}
                          disabled={backup.status !== 'completed'}
                          title={t('backups.restore')}
                        >
                          ↩️
                        </button>
                        <button
                          className="backups-btn backups-btn-xs backups-btn-outline"
                          onClick={() => handleDownload(backup)}
                          disabled={backup.status !== 'completed'}
                          title={t('backups.download')}
                        >
                          ⬇️
                        </button>
                        {backup.type === 'manual' && (
                          <button
                            className="backups-btn backups-btn-xs backups-btn-danger"
                            onClick={() => handleDelete(backup.id)}
                            title={t('backups.delete')}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Automatic Backups Info */}
      <div className="backups-auto-info">
        <h4>{t('backups.automaticBackups')}</h4>
        <div className="backups-auto-grid">
          <div className="backups-auto-item">
            <span className="backups-auto-icon">📅</span>
            <div>
              <strong>{t('backups.frequency')}</strong>
              <p>{t('backups.frequencyValue')}</p>
            </div>
          </div>
          <div className="backups-auto-item">
            <span className="backups-auto-icon">🕐</span>
            <div>
              <strong>{t('backups.retention')}</strong>
              <p>{t('backups.retentionValue')}</p>
            </div>
          </div>
          <div className="backups-auto-item">
            <span className="backups-auto-icon">📦</span>
            <div>
              <strong>{t('backups.includes')}</strong>
              <p>{t('backups.includesValue')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Restore Modal */}
      <RestoreBackupModal
        isOpen={showRestoreModal}
        backup={selectedBackup}
        onClose={() => {
          setShowRestoreModal(false);
          setSelectedBackup(null);
        }}
        onConfirm={handleRestoreConfirm}
      />
    </div>
  );
}

export default BackupsTab;
