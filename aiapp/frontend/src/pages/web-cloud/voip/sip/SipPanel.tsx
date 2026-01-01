// ============================================================
// SIP PANEL - NAV4 fixe: Général, Groups, Lines, Numbers, Services
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../../services/api';
import './SipPanel.css';

// Sub-tabs
import { GroupsTab } from './groups/GroupsTab';
import { LinesTab } from './lines/LinesTab';
import { NumbersTab } from './numbers/NumbersTab';
import { ServicesTab } from './services/ServicesTab';

type SipNav4 = 'general' | 'groups' | 'lines' | 'numbers' | 'services';

interface SipPanelProps {
  billingAccount: string;
  title: string;
  subtitle: string;
}

interface SipSummary {
  description: string;
  status: string;
  groupsCount: number;
  linesCount: number;
  numbersCount: number;
  servicesCount: number;
}

export function SipPanel({ billingAccount, title, subtitle }: SipPanelProps) {
  const { t } = useTranslation('web-cloud/voip/sip/index');

  // NAV4 state
  const [activeTab, setActiveTab] = useState<SipNav4>('general');

  // Summary data
  const [summary, setSummary] = useState<SipSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load summary data
  useEffect(() => {
    // Si pas de billingAccount, on affiche quand même les tabs avec un état vide
    if (!billingAccount) {
      setLoading(false);
      setSummary(null);
      return;
    }

    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        const [account, lines, numbers, services] = await Promise.all([
          ovhApi.get<{ billingAccount: string; description: string; status: string }>(`/telephony/${billingAccount}`),
          ovhApi.get<string[]>(`/telephony/${billingAccount}/line`).catch(() => []),
          ovhApi.get<string[]>(`/telephony/${billingAccount}/number`).catch(() => []),
          ovhApi.get<string[]>(`/telephony/${billingAccount}/service`).catch(() => []),
        ]);

        setSummary({
          description: account.description || billingAccount,
          status: account.status,
          groupsCount: 1,
          linesCount: lines.length,
          numbersCount: numbers.length,
          servicesCount: services.length,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [billingAccount]);

  // NAV4 tabs definition (labels en dur car traductions pas encore créées)
  const tabs: Array<{ id: SipNav4; label: string; count?: number }> = [
    { id: 'general', label: 'Général' },
    { id: 'groups', label: 'Groups', count: summary?.groupsCount },
    { id: 'lines', label: 'Lignes', count: summary?.linesCount },
    { id: 'numbers', label: 'Numéros', count: summary?.numbersCount },
    { id: 'services', label: 'Services', count: summary?.servicesCount },
  ];

  // Render General tab content
  const renderGeneralContent = () => {
    if (loading) {
      return (
        <div className="sip-panel-loading">
          <div className="voip-skeleton" style={{ width: '100%', height: 120 }} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="sip-panel-error">
          <span>⚠️</span> {error}
        </div>
      );
    }

    // Pas de service sélectionné
    if (!billingAccount || !summary) {
      return (
        <div className="sip-panel-empty">
          <div className="sip-panel-empty-icon">📞</div>
          <div className="sip-panel-empty-title">{t('empty.title') || 'Aucun service SIP'}</div>
          <div className="sip-panel-empty-description">
            {t('empty.description') || 'Sélectionnez un service dans la liste ou souscrivez à une offre VoIP.'}
          </div>
        </div>
      );
    }

    return (
      <div className="sip-panel-general">
        {/* Summary */}
        <div className="sip-panel-summary">
          <div className="sip-panel-summary-info">
            <h3>{summary.description || billingAccount}</h3>
            <p>{billingAccount}</p>
            <span className={`sip-panel-status ${summary.status === 'enabled' ? 'active' : 'expired'}`}>
              {summary.status === 'enabled' ? t('status.active') || 'Actif' : t('status.expired') || 'Expiré'}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="sip-panel-stats">
          <div className="sip-panel-stat">
            <div className="sip-panel-stat-icon">👥</div>
            <div className="sip-panel-stat-value">{summary.groupsCount || 0}</div>
            <div className="sip-panel-stat-label">{t('stats.groups') || 'Groups'}</div>
          </div>
          <div className="sip-panel-stat">
            <div className="sip-panel-stat-icon">📞</div>
            <div className="sip-panel-stat-value">{summary.linesCount || 0}</div>
            <div className="sip-panel-stat-label">{t('stats.lines') || 'Lines'}</div>
          </div>
          <div className="sip-panel-stat">
            <div className="sip-panel-stat-icon">🔢</div>
            <div className="sip-panel-stat-value">{summary.numbersCount || 0}</div>
            <div className="sip-panel-stat-label">{t('stats.numbers') || 'Numbers'}</div>
          </div>
          <div className="sip-panel-stat">
            <div className="sip-panel-stat-icon">⚙️</div>
            <div className="sip-panel-stat-value">{summary.servicesCount || 0}</div>
            <div className="sip-panel-stat-label">{t('stats.services') || 'Services'}</div>
          </div>
        </div>
      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralContent();
      case 'groups':
        return <GroupsTab billingAccount={billingAccount} />;
      case 'lines':
        return <LinesTab billingAccount={billingAccount} />;
      case 'numbers':
        return <NumbersTab billingAccount={billingAccount} />;
      case 'services':
        return <ServicesTab billingAccount={billingAccount} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Header */}
      <div className="voip-right-panel-header">
        <div className="voip-right-panel-header-info">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {summary && (
          <div className="voip-right-panel-header-actions">
            <span className={`voip-left-panel-item-badge ${summary.status === 'enabled' ? 'success' : 'warning'}`}>
              {summary.status === 'enabled' ? t('status.active') || 'Actif' : t('status.expired') || 'Expiré'}
            </span>
          </div>
        )}
      </div>

      {/* NAV4 Tabs */}
      <div className="voip-right-panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`voip-right-panel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && <span className="voip-right-panel-tab-count">{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="voip-right-panel-content">
        {renderTabContent()}
      </div>
    </>
  );
}

export default SipPanel;
