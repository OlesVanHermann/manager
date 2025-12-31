// ============================================================
// SECURITY TAB - Sécurité du groupe VoIP
// Target: target_.web-cloud.voip.group.security.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { securityTabService, type GroupEventToken } from './SecurityTab.service';
import './SecurityTab.css';

// ============================================================
// COMPOSANTS UI ISOLÉS (dupliqués selon prompt_split.txt)
// ============================================================

interface TileProps {
  title: string;
  children: ReactNode;
  className?: string;
}

function Tile({ title, children, className }: TileProps) {
  return (
    <div className={`voip-tile ${className || ''}`}>
      <div className="voip-tile-title">{title}</div>
      {children}
    </div>
  );
}

interface BadgeProps {
  type: 'success' | 'warning' | 'error' | 'info';
  children: ReactNode;
}

function Badge({ type, children }: BadgeProps) {
  return <span className={`voip-badge ${type}`}>{children}</span>;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="voip-empty-state">
      <div className="voip-empty-state-icon">{icon}</div>
      <div className="voip-empty-state-title">{title}</div>
      {description && <div className="voip-empty-state-description">{description}</div>}
      {action}
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface SecurityTabProps {
  billingAccount: string;
}

export function SecurityTab({ billingAccount }: SecurityTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/security');
  const [tokens, setTokens] = useState<GroupEventToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const data = await securityTabService.getEventTokens(billingAccount);
      setTokens(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, [billingAccount]);

  const handleDeleteToken = async (token: string) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await securityTabService.deleteEventToken(billingAccount, token);
      await loadTokens();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  if (loading) {
    return (
      <div className="security-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="security-tab">
      {/* Info sécurité */}
      <Tile title={t('info.title')}>
        <p className="security-info-text">{t('info.description')}</p>
      </Tile>

      {/* Event Tokens */}
      <div className="voip-table-container">
        <div className="voip-table-header">
          <div className="voip-table-title">{t('tokens.title')}</div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            + {t('tokens.add')}
          </button>
        </div>
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.token')}</th>
              <th>{t('table.type')}</th>
              <th>{t('table.url')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((tokenItem) => (
              <tr key={tokenItem.token}>
                <td className="monospace">{tokenItem.token.substring(0, 16)}...</td>
                <td>
                  <Badge type="info">{tokenItem.type}</Badge>
                </td>
                <td className="url">{tokenItem.callbackUrl}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteToken(tokenItem.token)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            {tokens.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="🔐"
                    title={t('empty.title')}
                    description={t('empty.description')}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Token Modal - Placeholder */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('modal.addToken.title')}</h3>
            <p>{t('modal.addToken.description')}</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                {t('actions.cancel')}
              </button>
              <button className="btn btn-primary">
                {t('actions.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
