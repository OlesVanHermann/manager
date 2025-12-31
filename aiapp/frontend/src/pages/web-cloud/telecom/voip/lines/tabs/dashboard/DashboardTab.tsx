// ============================================================
// LINE DASHBOARD TAB - Tableau de bord de la ligne VoIP
// Target: target_.web-cloud.voip.line.dashboard.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { linesService } from '../../lines.service';
import { Tile, ActionItem, InfoRow, Badge, ConsumptionCircle } from '../../../components/RightPanel';
import type { TelephonyLine, TelephonyPhone } from '../../../voip.types';
import type { LineCall } from '../../lines.types';
import './DashboardTab.css';

interface DashboardTabProps {
  billingAccount: string;
  serviceName: string;
  line: TelephonyLine;
  phone: TelephonyPhone | null;
}

export function DashboardTab({ billingAccount, serviceName, line, phone }: DashboardTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/dashboard');
  const navigate = useNavigate();

  const [recentCalls, setRecentCalls] = useState<LineCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const calls = await linesService.getCalls(billingAccount, serviceName);
        setRecentCalls(calls.slice(0, 5));
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
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/line/${serviceName}/click2call`),
    },
    {
      label: t('quickActions.voicemail'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/line/${serviceName}/options`),
    },
    {
      label: t('quickActions.forward'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/line/${serviceName}/options`),
    },
    {
      label: t('quickActions.consumption'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/line/${serviceName}/consumption`),
    },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

      {/* Derniers appels */}
      <div className="voip-table-container">
        <div className="voip-table-title">{t('calls.title')}</div>
        <table className="voip-table">
          <thead>
            <tr>
              <th>{t('calls.type')}</th>
              <th>{t('calls.number')}</th>
              <th>{t('calls.date')}</th>
              <th>{t('calls.duration')}</th>
            </tr>
          </thead>
          <tbody>
            {recentCalls.map((call) => (
              <tr key={call.id}>
                <td>
                  <span className={`call-type ${call.type}`}>
                    {call.type === 'incoming' ? '📥' : '📤'}
                  </span>
                </td>
                <td className="monospace">
                  {call.type === 'incoming' ? call.callingNumber : call.calledNumber}
                </td>
                <td>{new Date(call.date).toLocaleString('fr-FR')}</td>
                <td>{formatDuration(call.duration)}</td>
              </tr>
            ))}
            {recentCalls.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-message">
                  {t('calls.empty')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
