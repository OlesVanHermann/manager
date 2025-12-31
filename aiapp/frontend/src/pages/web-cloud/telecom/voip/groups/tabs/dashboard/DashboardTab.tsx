// ============================================================
// DASHBOARD TAB - Dashboard du groupe VoIP
// Target: target_.web-cloud.voip.group.dashboard.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupsService } from '../../groups.service';
import { voipService } from '../../../voip.service';
import {
  Tile,
  ActionItem,
  InfoRow,
  Badge,
  ConsumptionCircle,
} from '../../../components/RightPanel';
import type { TelephonyBillingAccount, TelephonyHistoryConsumption, TelephonyPhone } from '../../../voip.types';
import './DashboardTab.css';

interface DashboardTabProps {
  billingAccount: string;
  group: TelephonyBillingAccount;
}

export function DashboardTab({ billingAccount, group }: DashboardTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/groups/dashboard');
  const navigate = useNavigate();

  // State
  const [consumption, setConsumption] = useState<TelephonyHistoryConsumption[]>([]);
  const [phones, setPhones] = useState<Array<{ serviceName: string; phone: TelephonyPhone | null }>>([]);
  const [counts, setCounts] = useState({ lines: 0, numbers: 0, fax: 0 });
  const [loading, setLoading] = useState(true);

  // Charger les données du dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [consumptionData, phonesData, lines, numbers, faxList] = await Promise.all([
          groupsService.getHistoryConsumption(billingAccount),
          voipService.getAllPhones(billingAccount),
          groupsService.getLines(billingAccount).catch(() => []),
          groupsService.getNumbers(billingAccount).catch(() => []),
          groupsService.getFaxList(billingAccount).catch(() => []),
        ]);
        setConsumption(consumptionData.slice(0, 5));
        setPhones(phonesData);
        setCounts({
          lines: lines.length,
          numbers: numbers.length,
          fax: faxList.length,
        });
      } catch {
        // Erreurs silencieuses
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [billingAccount]);

  // Actions rapides
  const quickActions = [
    {
      label: t('quickActions.orderNumber'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/order`),
    },
    {
      label: t('quickActions.viewInvoices'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/billing`),
    },
    {
      label: t('quickActions.portability'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/portability`),
    },
    {
      label: t('quickActions.abbreviated'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/abbreviated`),
    },
  ];

  // Calculer le pourcentage de consommation (placeholder)
  const consumptionPercentage = consumption.length > 0 ? 72 : 0;
  const outplanAmount = group.currentOutplan || 0;

  if (loading) {
    return (
      <div className="dashboard-tab">
        <div className="voip-tiles-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="voip-skeleton voip-skeleton-tile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-tab">
      {/* Tiles row */}
      <div className="voip-tiles-row">
        {/* Tile: Actions rapides */}
        <Tile title={t('quickActions.title')}>
          {quickActions.map((action, i) => (
            <ActionItem key={i} label={action.label} onClick={action.onClick} />
          ))}
        </Tile>

        {/* Tile: Informations générales */}
        <Tile title={t('info.title')}>
          <InfoRow
            label={t('info.status')}
            value={
              <Badge type={group.status === 'enabled' ? 'success' : 'error'}>
                {group.status === 'enabled' ? t('info.statusActive') : t('info.statusExpired')}
              </Badge>
            }
          />
          <InfoRow label={t('info.lines')} value={counts.lines} />
          <InfoRow label={t('info.numbers')} value={counts.numbers} />
          <InfoRow label={t('info.fax')} value={counts.fax} />
          <InfoRow
            label={t('info.credit')}
            value={`${(group.creditThreshold || 0).toFixed(2)} €`}
            className="credit"
          />
        </Tile>

        {/* Tile: Consommation */}
        <Tile title={t('consumption.title')}>
          <ConsumptionCircle percentage={consumptionPercentage} outplanAmount={outplanAmount} />
        </Tile>
      </div>

      {/* Table: Derniers relevés */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('history.title')}</div>
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('history.date')}</th>
              <th>{t('history.amount')}</th>
              <th>{t('history.paid')}</th>
              <th>{t('history.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {consumption.map((item, i) => (
              <tr key={i}>
                <td>{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                <td>{item.price.value.toFixed(2)} €</td>
                <td className={item.status === 'paid' ? 'success' : ''}>
                  {item.status === 'paid' ? t('history.yes') : t('history.no')}
                </td>
                <td>
                  <span className="link">📄 PDF</span>
                  <span className="link" style={{ marginLeft: 16 }}>
                    📊 CSV
                  </span>
                </td>
              </tr>
            ))}
            {consumption.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 20 }}>
                  {t('history.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Parc VoIP */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('phones.title')}</div>
        <div style={{ padding: 16 }}>
          <div className="voip-phone-cards">
            {phones.map((p) => (
              <div key={p.serviceName} className="voip-phone-card">
                <div className="voip-phone-card-title">
                  {p.phone ? `☎️ ${p.phone.brand} ${p.phone.model}` : '📱 Ligne nue'}
                </div>
                <div className="voip-phone-card-number">{p.serviceName}</div>
                {p.phone && <div className="voip-phone-card-mac">{p.phone.macAddress}</div>}
              </div>
            ))}
            {phones.length === 0 && (
              <div style={{ color: '#6B7280', fontSize: 12 }}>{t('phones.empty')}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
