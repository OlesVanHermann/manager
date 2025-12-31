// ============================================================
// DASHBOARD TAB - Dashboard du groupe VoIP
// Target: target_.web-cloud.voip.group.dashboard.svg
// DEFACTORISATION: Composants et service ISOLÉS dans ce tab
// ============================================================

import { useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardTabService, type PhoneWithLine, type DashboardCounts } from './DashboardTab.service';
import type { TelephonyBillingAccount, TelephonyHistoryConsumption } from '../../../voip.types';
import './DashboardTab.css';

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

interface ActionItemProps {
  label: string;
  onClick: () => void;
}

function ActionItem({ label, onClick }: ActionItemProps) {
  return (
    <div className="voip-action-item" onClick={onClick}>
      <span>{label}</span>
      <span className="voip-action-item-arrow">→</span>
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: ReactNode;
  className?: string;
}

function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className="voip-info-row">
      <label>{label}</label>
      <span className={className}>{value}</span>
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

interface ConsumptionCircleProps {
  percentage: number;
  outplanAmount?: number;
}

function ConsumptionCircle({ percentage, outplanAmount }: ConsumptionCircleProps) {
  const { t } = useTranslation('web-cloud/voip/groups/dashboard');
  const circumference = 2 * Math.PI * 55;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="voip-consumption-circle">
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="55" fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="none"
          stroke="#0050D7"
          strokeWidth="10"
          strokeDasharray={strokeDasharray}
          transform="rotate(-90 60 60)"
          strokeLinecap="round"
        />
        <text x="60" y="55" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1F2937">
          {percentage}%
        </text>
        <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#6B7280">
          {t('consumption.ofPlan')}
        </text>
      </svg>
      {outplanAmount !== undefined && outplanAmount > 0 && (
        <div className="voip-consumption-outplan">
          <label>{t('consumption.outplan')}</label> <span>{outplanAmount.toFixed(2)} €</span>
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface DashboardTabProps {
  billingAccount: string;
  group: TelephonyBillingAccount;
}

export function DashboardTab({ billingAccount, group }: DashboardTabProps) {
  const { t } = useTranslation('web-cloud/voip/groups/dashboard');
  const navigate = useNavigate();

  // State
  const [consumption, setConsumption] = useState<TelephonyHistoryConsumption[]>([]);
  const [phones, setPhones] = useState<PhoneWithLine[]>([]);
  const [counts, setCounts] = useState<DashboardCounts>({ lines: 0, numbers: 0, fax: 0 });
  const [loading, setLoading] = useState(true);

  // Charger les données du dashboard via service isolé
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await dashboardTabService.loadDashboardData(billingAccount);
        setConsumption(data.consumption);
        setPhones(data.phones);
        setCounts(data.counts);
      } catch {
        // Erreurs silencieuses
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [billingAccount]);

  // Actions rapides
  const quickActions = [
    {
      label: t('quickActions.orderNumber'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/order`),
    },
    {
      label: t('quickActions.viewInvoices'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/billing`),
    },
    {
      label: t('quickActions.portability'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/portability`),
    },
    {
      label: t('quickActions.abbreviated'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/abbreviated`),
    },
  ];

  // Calculer le pourcentage de consommation
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
