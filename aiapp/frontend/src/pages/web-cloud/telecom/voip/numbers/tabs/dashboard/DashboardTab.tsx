// ============================================================
// NUMBER DASHBOARD TAB - Tableau de bord du numéro VoIP
// Target: target_.web-cloud.voip.number.dashboard.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { numbersService } from '../../numbers.service';
import { Tile, ActionItem, InfoRow, Badge } from '../../../components/RightPanel';
import type { TelephonyNumber } from '../../../voip.types';
import type { NumberCall } from '../../numbers.types';
import './DashboardTab.css';

interface DashboardTabProps {
  billingAccount: string;
  serviceName: string;
  number: TelephonyNumber;
}

export function DashboardTab({ billingAccount, serviceName, number }: DashboardTabProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/numbers/dashboard');
  const navigate = useNavigate();

  const [recentCalls, setRecentCalls] = useState<NumberCall[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const calls = await numbersService.getCalls(billingAccount, serviceName);
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
      label: t('quickActions.configure'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/number/${serviceName}/configuration`),
    },
    {
      label: t('quickActions.scheduler'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/number/${serviceName}/scheduler`),
    },
    {
      label: t('quickActions.records'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/number/${serviceName}/records`),
    },
    {
      label: t('quickActions.consumption'),
      onClick: () => navigate(`/web-cloud/telecom/voip/${billingAccount}/number/${serviceName}/consumption`),
    },
  ];

  const getFeatureLabel = (featureType: string) => {
    const labels: Record<string, string> = {
      redirect: t('feature.redirect'),
      ddi: t('feature.ddi'),
      conference: t('feature.conference'),
      ivr: t('feature.ivr'),
      voicemail: t('feature.voicemail'),
      svi: t('feature.svi'),
      easyHunting: t('feature.easyHunting'),
      miniPabx: t('feature.miniPabx'),
    };
    return labels[featureType] || featureType;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="number-dashboard-tab">
        <div className="voip-tiles-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="voip-skeleton voip-skeleton-tile" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="number-dashboard-tab">
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
            label={t('info.number')}
            value={<span className="monospace">{serviceName}</span>}
          />
          <InfoRow
            label={t('info.feature')}
            value={
              <Badge type="info">
                {getFeatureLabel(number.featureType)}
              </Badge>
            }
          />
          <InfoRow
            label={t('info.country')}
            value={number.country || 'FR'}
          />
          <InfoRow
            label={t('info.zone')}
            value={number.zone || '-'}
          />
        </Tile>

        {/* Configuration actuelle */}
        <Tile title={t('config.title')}>
          <div className="config-visual">
            <div className="config-icon">
              {number.featureType === 'redirect' && '➡️'}
              {number.featureType === 'conference' && '👥'}
              {number.featureType === 'ivr' && '🔢'}
              {number.featureType === 'voicemail' && '📧'}
              {!['redirect', 'conference', 'ivr', 'voicemail'].includes(number.featureType) && '📞'}
            </div>
            <div className="config-info">
              <div className="config-type">{getFeatureLabel(number.featureType)}</div>
              <div className="config-dest">
                {number.featureType === 'redirect' && t('config.redirectTo')}
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-secondary" style={{ marginTop: 12 }}>
            {t('config.modify')}
          </button>
        </Tile>
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
