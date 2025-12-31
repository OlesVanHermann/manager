// ============================================================
// LINE CLICK2CALL TAB - Click-to-call
// Target: target_.web-cloud.voip.line.click2call.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { click2callTabService, type Click2CallUser } from './Click2CallTab.service';
import './Click2CallTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

function EmptyState({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="voip-empty-state">
      <span className="voip-empty-icon">{icon}</span>
      <h3 className="voip-empty-title">{title}</h3>
      <p className="voip-empty-description">{description}</p>
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface Click2CallTabProps {
  billingAccount: string;
  serviceName: string;
}

export function Click2CallTab({ billingAccount, serviceName }: Click2CallTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/click2call');
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
      const data = await click2callTabService.getClick2CallUsers(billingAccount, serviceName);
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
      await click2callTabService.click2Call(billingAccount, serviceName, numberToCall);
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
      await click2callTabService.deleteClick2CallUser(billingAccount, serviceName, userId);
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
                <td>{new Date(user.creationDateTime).toLocaleDateString('fr-FR')}</td>
                <td>
                  <Badge type="success">
                    {t('status.active')}
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
