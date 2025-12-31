// ============================================================
// LINE DASHBOARD TAB - Tableau de bord de la ligne VoIP
// Target: target_.web-cloud.voip.line.dashboard.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardTabService } from './DashboardTab.service';
import type { TelephonyLine, TelephonyPhone } from '../../../voip.types';
import './DashboardTab.css';

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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="voip-info-row">
      <span className="voip-info-label">{label}</span>
      <span className="voip-info-value">{value}</span>
    </div>
  );
}

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

function ActionItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="voip-action-item" onClick={onClick}>
      <span className="voip-action-label">{label}</span>
      <span className="voip-action-arrow">→</span>
    </button>
  );
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface DashboardTabProps {
  billingAccount: string;
  serviceName: string;
  line: TelephonyLine;
  phone: TelephonyPhone | null;
}

export function DashboardTab({ billingAccount, serviceName, line, phone }: DashboardTabProps) {
  const { t } = useTranslation('web-cloud/voip/lines/dashboard');
  const navigate = useNavigate();

  const [recentCallsCount, setRecentCallsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const count = await dashboardTabService.getRecentCalls(billingAccount, serviceName);
        setRecentCallsCount(count);
      } catch {
        // Erreur silencieuse
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [billingAccount, serviceName]);

  const quickActions = [
    {
      label: t('quickActions.click2call'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/line/${serviceName}/click2call`),
    },
    {
      label: t('quickActions.voicemail'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/line/${serviceName}/options`),
    },
    {
      label: t('quickActions.forward'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/line/${serviceName}/options`),
    },
    {
      label: t('quickActions.consumption'),
      onClick: () => navigate(`/web-cloud/voip/${billingAccount}/line/${serviceName}/consumption`),
    },
  ];

  if (loading) {
    return (
      <div className="line-dashboard-tab">
        <div className="voip-tiles-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="voip-skeleton voip-skeleton-tile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="line-dashboard-tab">
      {/* Tiles row */}
      <div className="voip-tiles-row">
        {/* Actions rapides */}
        <Tile title={t('quickActions.title')}>
          {quickActions.map((action, i) => (
            <ActionItem key={i} label={action.label} onClick={action.onClick} />
          ))}
        </Tile>

        {/* Informations */}
        <Tile title={t('info.title')}>
          <InfoRow
            label={t('info.status')}
            value={
              <Badge type={line.isAttachedToOtherLinesPhone ? 'warning' : 'success'}>
                {line.isAttachedToOtherLinesPhone ? t('info.attached') : t('info.active')}
              </Badge>
            }
          />
          <InfoRow label={t('info.offer')} value={line.offers?.[0] || '-'} />
          <InfoRow
            label={t('info.simultaneousLines')}
            value={line.simultaneousLines || 1}
          />
          <InfoRow
            label={t('info.phone')}
            value={phone ? `${phone.brand} ${phone.model}` : t('info.noPhone')}
          />
        </Tile>

        {/* Téléphone */}
        {phone && (
          <Tile title={t('phone.title')}>
            <div className="phone-visual">
              <div className="phone-icon">📞</div>
              <div className="phone-info">
                <div className="phone-model">{phone.brand} {phone.model}</div>
                <div className="phone-mac">{phone.macAddress}</div>
              </div>
            </div>
            <InfoRow label={t('phone.protocol')} value={phone.protocol?.toUpperCase()} />
            <InfoRow label={t('phone.ip')} value={phone.ip || '-'} />
          </Tile>
        )}
      </div>

      {/* Statistiques appels récents */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('calls.title')}</div>
        <div className="calls-summary">
          <div className="calls-stat">
            <span className="calls-stat-value">{recentCallsCount}</span>
            <span className="calls-stat-label">{t('calls.recentCount')}</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/web-cloud/voip/${billingAccount}/line/${serviceName}/calls`)}
          >
            {t('calls.viewAll')}
          </button>
        </div>
      </div>
    </div>
  );
}
