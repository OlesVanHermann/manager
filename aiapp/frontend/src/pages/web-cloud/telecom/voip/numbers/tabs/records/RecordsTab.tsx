// ============================================================
// NUMBER RECORDS TAB - Enregistrements du numéro
// Target: target_.web-cloud.voip.number.records.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, Badge, EmptyState } from '../../../components/RightPanel';
import type { NumberRecord } from '../../numbers.types';
import './RecordsTab.css';

interface RecordsTabProps {
  billingAccount: string;
  serviceName: string;
}

export function RecordsTab({ billingAccount, serviceName }: RecordsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/records');
  const [records, setRecords] = useState<NumberRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, [billingAccount, serviceName]);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const data = await numbersService.getRecords(billingAccount, serviceName);
      setRecords(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (recordId: string) => {
    try {
      const url = await numbersService.downloadRecord(billingAccount, serviceName, recordId);
      window.open(url, '_blank');
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.download'));
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await numbersService.deleteRecord(billingAccount, serviceName, recordId);
      await loadRecords();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="number-records-tab">
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="number-records-tab">
      {/* Info */}
      <Tile title={t('info.title')}>
        <p className="records-description">{t('info.description')}</p>
        <div className="records-stats">
          <span className="stat">
            <strong>{records.length}</strong> {t('info.recordings')}
          </span>
          <span className="stat">
            <strong>{records.filter((r) => r.status === 'available').length}</strong> {t('info.available')}
          </span>
        </div>
      </Tile>

      {/* Liste des enregistrements */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('list.title')}</div>
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.date')}</th>
              <th>{t('table.caller')}</th>
              <th>{t('table.called')}</th>
              <th>{t('table.duration')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{new Date(record.date).toLocaleString('fr-FR')}</td>
                <td className="monospace">{record.callingNumber}</td>
                <td className="monospace">{record.calledNumber}</td>
                <td>{formatDuration(record.duration)}</td>
                <td>
                  <Badge type={record.status === 'available' ? 'success' : 'warning'}>
                    {t(`status.${record.status}`)}
                  </Badge>
                </td>
                <td>
                  <div className="record-actions">
                    {record.status === 'available' && (
                      <>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleDownload(record.id)}
                        >
                          ⬇️
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(record.id)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="🎙️"
                    title={t('empty.title')}
                    description={t('empty.description')}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
