// ============================================================
// REPAYMENTS TAB - Remboursements du groupe VoIP
// Target: target_.web-cloud.voip.group.repayments.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { Badge, EmptyState } from '../../../components/RightPanel';
import type { GroupRepayment } from '../../groups.types';
import './RepaymentsTab.css';

interface RepaymentsTabProps {
  billingAccount: string;
}

export function RepaymentsTab({ billingAccount }: RepaymentsTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/repayments');
  const [repayments, setRepayments] = useState<GroupRepayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepayments = async () => {
      try {
        setLoading(true);
        const data = await groupsService.getRepayments(billingAccount);
        setRepayments(data);
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadRepayments();
  }, [billingAccount]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const handleRequestRepayment = async (consumptionId: number) => {
    try {
      await groupsService.requestRepayment(billingAccount, consumptionId);
      // Recharger les données
      const data = await groupsService.getRepayments(billingAccount);
      setRepayments(data);
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
