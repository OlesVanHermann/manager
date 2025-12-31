// ============================================================
// BILLING TAB - Facturation du groupe VoIP
// Target: target_.web-cloud.voip.group.billing.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { Tile, InfoRow, Badge, EmptyState } from '../../../components/RightPanel';
import type { TelephonyHistoryConsumption } from '../../../voip.types';
import './BillingTab.css';

interface BillingTabProps {
  billingAccount: string;
}

export function BillingTab({ billingAccount }: BillingTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/billing');
  const [consumption, setConsumption] = useState<TelephonyHistoryConsumption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        setLoading(true);
        const data = await groupsService.getHistoryConsumption(billingAccount);
        setConsumption(data);
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadBilling();
  }, [billingAccount]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  const totalAmount = consumption.reduce((sum, c) => sum + c.price.value, 0);

  if (loading) {
    return (
      <div className="billing-tab">
        <div className="voip-skeleton voip-skeleton-tile" />
        <div className="voip-skeleton voip-skeleton-table" />
      </div>
    );
  }

  return (
    <div className="billing-tab">
      {/* Résumé */}
      <Tile title={t('summary.title')}>
        <InfoRow
          label={t('summary.totalConsumption')}
          value={`${totalAmount.toFixed(2)} €`}
        />
        <InfoRow
          label={t('summary.invoicesCount')}
          value={consumption.length}
        />
      </Tile>

      {/* Historique */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('history.title')}</div>
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
            {consumption.map((item, i) => (
              <tr key={i}>
                <td>{formatDate(item.date)}</td>
                <td>{item.description || t('table.consumption')}</td>
                <td className="amount">{item.price.value.toFixed(2)} €</td>
                <td>
                  <Badge type={item.status === 'paid' ? 'success' : 'warning'}>
                    {item.status === 'paid' ? t('status.paid') : t('status.pending')}
                  </Badge>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary">
                    📄 {t('actions.pdf')}
                  </button>
                </td>
              </tr>
            ))}
            {consumption.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40 }}>
                  <EmptyState
                    icon="💰"
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
