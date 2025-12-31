// ============================================================
// REPAYMENTS TAB - Remboursements du groupe VoIP
// Target: target_.web-cloud.voip.group.repayments.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { repaymentsTabService, type GroupRepayment } from './RepaymentsTab.service';
import './RepaymentsTab.css';

// ============================================================
// COMPOSANTS UI ISOLÉS (dupliqués selon prompt_split.txt)
// ============================================================

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

interface RepaymentsTabProps {
  billingAccount: string;
}

export function RepaymentsTab({ billingAccount }: RepaymentsTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/repayments');
  const [repayments, setRepayments] = useState<GroupRepayment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRepayments = async () => {
    try {
      setLoading(true);
      const data = await repaymentsTabService.getRepayments(billingAccount);
      setRepayments(data);
    } catch {
      // Erreur silencieuse
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepayments();
  }, [billingAccount]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const handleRequestRepayment = async (consumptionId: number) => {
    try {
      await repaymentsTabService.requestRepayment(billingAccount, consumptionId);
      await loadRepayments();
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.request'));
    }
  };

  if (loading) {
    return (
      <div className="repayments-tab">
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="repayments-tab">
      {/* Info */}
      <div className="repayments-info">
        <p>{t('info.description')}</p>
      </div>

      {/* Table */}
      <div className="voip-table-container">
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('table.date')}</th>
              <th>{t('table.description')}</th>
              <th>{t('table.amount')}</th>
              <th>{t('table.status')}</th>
              <th>{t('table.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {repayments.map((r) => (
              <tr key={r.consumptionId}>
                <td>{formatDate(r.date)}</td>
                <td>{r.description || '-'}</td>
                <td className="amount">{r.price.toFixed(2)} €</td>
                <td>
                  <Badge type={r.status === 'done' ? 'success' : 'warning'}>
                    {t(`status.${r.status}`)}
                  </Badge>
                </td>
                <td>
                  {r.status === 'pending' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleRequestRepayment(r.consumptionId)}
                    >
                      {t('actions.request')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {repayments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="💸"
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
