// ============================================================
// LINE CLICK2CALL TAB - Click-to-call
// Target: target_.web-cloud.voip.line.click2call.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import type { Click2CallUser } from '../../lines.types';
import './Click2CallTab.css';

interface Click2CallTabProps {
  billingAccount: string;
  serviceName: string;
}

export function Click2CallTab({ billingAccount, serviceName }: Click2CallTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/click2call');
  const [users, setUsers] = useState<Click2CallUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(false);
  const [numberToCall, setNumberToCall] = useState('');

  useEffect(() => {
    loadUsers();
  }, [billingAccount, serviceName]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await linesService.getClick2CallUsers(billingAccount, serviceName);
      setUsers(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleCall = async () => {
    if (!numberToCall.trim()) {
      alert(t('error.emptyNumber'));
      return;
    }

    try {
      setCalling(true);
      await linesService.click2Call(billingAccount, serviceName, numberToCall);
      alert(t('success.call'));
      setNumberToCall('');
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.call'));
    } finally {
      setCalling(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm(t('confirm.deleteUser'))) return;

    try {
      await linesService.deleteClick2CallUser(billingAccount, serviceName, userId);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.deleteUser'));
    }
  };

  if (loading) {
    return (
      <div className="line-click2call-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="line-click2call-tab">
      {/* Appeler maintenant */}
      <Tile title={t('call.title')}>
        <p className="call-description">{t('call.description')}</p>
        <div className="call-form">
          <input
            type="tel"
            placeholder={t('call.placeholder')}
            value={numberToCall}
            onChange={(e) => setNumberToCall(e.target.value)}
            className="call-input"
          />
          <button
            className="btn btn-primary call-btn"
            onClick={handleCall}
            disabled={calling}
          >
            📞 {calling ? t('call.calling') : t('call.button')}
          </button>
        </div>
      </Tile>

      {/* Utilisateurs Click2Call */}
      <div className="voip-table-container">
        <div className="voip-table-header">
          <div className="voip-table-title">{t('users.title')}</div>
          <button className="btn btn-primary btn-sm">
            + {t('users.add')}
          </button>
        </div>
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.login')}</th>
              <th>{t('table.creationDate')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="monospace">{user.login}</td>
                <td>{new Date(user.creationDate).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Badge type={user.status === 'active' ? 'success' : 'warning'}>
                    {t(`status.${user.status}`)}
                  </Badge>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="👤"
                    title={t('empty.title')}
                    description={t('empty.description')}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Informations */}
      <Tile title={t('info.title')}>
        <p className="info-text">{t('info.description')}</p>
        <div className="info-links">
          <a href="#" className="info-link">📚 {t('info.documentation')}</a>
          <a href="#" className="info-link">🔧 {t('info.api')}</a>
        </div>
      </Tile>
    </div>
  );
}
