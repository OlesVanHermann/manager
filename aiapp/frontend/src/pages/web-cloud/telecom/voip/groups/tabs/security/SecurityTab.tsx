// ============================================================
// SECURITY TAB - Sécurité du groupe VoIP
// Target: target_.web-cloud.voip.group.security.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import type { GroupEventToken } from '../../groups.types';
import './SecurityTab.css';

interface SecurityTabProps {
  billingAccount: string;
}

export function SecurityTab({ billingAccount }: SecurityTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/security');
  const [tokens, setTokens] = useState<GroupEventToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadTokens();
  }, [billingAccount]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const data = await groupsService.getEventTokens(billingAccount);
      setTokens(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToken = async (token: string) => {
    if (!confirm(t('confirm.delete'))) return;

    try {
      await groupsService.deleteEventToken(billingAccount, token);
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
            {tokens.map((t) => (
              <tr key={t.token}>
                <td className="monospace">{t.token.substring(0, 16)}...</td>
                <td>
                  <Badge type="info">{t.type}</Badge>
                </td>
                <td className="url">{t.callbackUrl}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteToken(t.token)}
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
