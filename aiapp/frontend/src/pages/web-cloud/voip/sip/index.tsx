// ============================================================
// VOIP INDEX PAGE - Dashboard avec Left Panel + Right Panel
// Target: target_.web-cloud.voip.dashboard.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { voipService } from './voip.service';
import { LeftPanel } from './LeftPanel';
import {
  RightPanel,
  Tile,
  ActionItem,
  InfoRow,
  Badge,
  ConsumptionCircle,
  EmptyState,
} from './RightPanel';
import type { TelephonyGroupSummary, TelephonyHistoryConsumption, TelephonyPhone } from './voip.types';
import './voip.css';

type GroupTabId = 'dashboard' | 'services' | 'phonebook' | 'billing' | 'admin';

export default function VoipIndexPage() {
  const { t } = useTranslation('web-cloud/voip/index');
  const navigate = useNavigate();

  // State
  const [groups, setGroups] = useState<TelephonyGroupSummary[]>([]);
  const [smsAccounts, setSmsAccounts] = useState<Array<{ name: string; creditsLeft: number }>>([]);
  const [faxServices, setFaxServices] = useState<Array<{ serviceName: string; description?: string }>>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GroupTabId>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data
  const [consumption, setConsumption] = useState<TelephonyHistoryConsumption[]>([]);
  const [phones, setPhones] = useState<Array<{ serviceName: string; phone: TelephonyPhone | null }>>([]);

  // Charger la liste des groupes, SMS et FAX
  useEffect(() => {
    const loadAllServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaries, smsData, faxData] = await Promise.all([
          voipService.getAllGroupsSummaries(),
          voipService.getAllSmsAccountsSummaries(),
          voipService.getAllFaxServicesSummaries(),
        ]);
        setGroups(summaries);
        setSmsAccounts(smsData);
        setFaxServices(faxData);
        if (summaries.length > 0 && !selectedGroup) {
          setSelectedGroup(summaries[0].billingAccount);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.loading'));
      } finally {
        setLoading(false);
      }
    };
    loadAllServices();
  }, []);

  // Charger les données du dashboard quand un groupe est sélectionné
  useEffect(() => {
    if (!selectedGroup) return;

    const loadDashboardData = async () => {
      try {
        const [consumptionData, phonesData] = await Promise.all([
          voipService.getHistoryConsumption(selectedGroup),
          voipService.getAllPhones(selectedGroup),
        ]);
        setConsumption(consumptionData.slice(0, 5));
        setPhones(phonesData);
      } catch {
        // Ignorer les erreurs secondaires
      }
    };
    loadDashboardData();
  }, [selectedGroup]);

  // Groupe sélectionné
  const currentGroup = groups.find((g) => g.billingAccount === selectedGroup);

  // Tabs
  const tabs = [
    { id: 'dashboard' as const, label: t('tabs.dashboard') },
    { id: 'services' as const, label: t('tabs.services') },
    { id: 'phonebook' as const, label: t('tabs.phonebook') },
    { id: 'billing' as const, label: t('tabs.billing') },
    { id: 'admin' as const, label: t('tabs.admin') },
  ];

  // Calculer le pourcentage de consommation
  const consumptionPercentage = consumption.length > 0 ? 72 : 0; // Placeholder
  const outplanAmount = currentGroup?.currentOutplan || 0;

  // Actions rapides
  const quickActions = [
    { label: t('actions.orderNumber'), onClick: () => navigate(`/web-cloud/voip/${selectedGroup}/order`) },
    { label: t('actions.viewInvoices'), onClick: () => setActiveTab('billing') },
    { label: t('actions.portability'), onClick: () => navigate(`/web-cloud/voip/${selectedGroup}/portability`) },
    { label: t('actions.abbreviated'), onClick: () => navigate(`/web-cloud/voip/${selectedGroup}/abbreviated`) },
  ];

  // Onboarding si aucun service (VoIP, SMS, FAX)
  const hasNoServices = groups.length === 0 && smsAccounts.length === 0 && faxServices.length === 0;
  if (!loading && hasNoServices) {
    const guides = [
      {
        key: 'faq',
        url: 'https://docs.ovh.com/fr/voip/faq-voip/',
      },
      {
        key: 'plugPhone',
        url: 'https://docs.ovh.com/fr/voip/gerer-telephone-plug-and-phone/',
      },
      {
        key: 'activate',
        url: 'https://docs.ovh.com/fr/voip/activer-services/',
      },
    ];

    return (
      <div className="voip-onboarding">
        <div className="voip-onboarding-card">
          {/* Contenu principal : illustration + texte */}
          <div className="voip-onboarding-content">
            {/* Illustration gauche */}
            <div className="voip-onboarding-illustration">
              <span className="voip-onboarding-illustration-icon">📞</span>
            </div>

            {/* Contenu droite */}
            <div className="voip-onboarding-info">
              <h1 className="voip-onboarding-title">{t('onboarding.title')}</h1>
              <p className="voip-onboarding-description">
                {t('onboarding.description1')}
                <br /><br />
                {t('onboarding.description2')}
              </p>

              {/* Features */}
              <ul className="voip-onboarding-features">
                <li>{t('onboarding.features.lines')}</li>
                <li>{t('onboarding.features.numbers')}</li>
                <li>{t('onboarding.features.fax')}</li>
                <li>{t('onboarding.features.portability')}</li>
              </ul>

              {/* CTA */}
              <button
                className="voip-onboarding-cta"
                onClick={() => window.open('https://www.ovhcloud.com/fr/telephony/', '_blank')}
              >
                {t('onboarding.cta')}
              </button>
            </div>
          </div>

          {/* Section Guides */}
          <div className="voip-onboarding-guides">
            <h2 className="voip-onboarding-guides-title">{t('onboarding.guides.title')}</h2>
            <div className="voip-onboarding-guides-list">
              {guides.map((guide) => (
                <a
                  key={guide.key}
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="voip-onboarding-guide-card"
                >
                  <div className="voip-onboarding-guide-info">
                    <h3 className="voip-onboarding-guide-title">
                      {t(`onboarding.guides.${guide.key}.title`)}
                    </h3>
                    <p className="voip-onboarding-guide-description">
                      {t(`onboarding.guides.${guide.key}.description`)}
                    </p>
                  </div>
                  <span className="voip-onboarding-guide-arrow">→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Tiles row */}
            <div className="voip-tiles-row">
              {/* Tile: Actions rapides */}
              <Tile title={t('dashboard.quickActions.title')}>
                {quickActions.map((action, i) => (
                  <ActionItem key={i} label={action.label} onClick={action.onClick} />
                ))}
              </Tile>

              {/* Tile: Informations générales */}
              <Tile title={t('dashboard.info.title')}>
                <InfoRow
                  label={t('dashboard.info.status')}
                  value={
                    <Badge type={currentGroup?.status === 'enabled' ? 'success' : 'error'}>
                      {currentGroup?.status === 'enabled' ? t('status.active') : t('status.expired')}
                    </Badge>
                  }
                />
                <InfoRow label={t('dashboard.info.lines')} value={currentGroup?.linesCount || 0} />
                <InfoRow label={t('dashboard.info.numbers')} value={currentGroup?.numbersCount || 0} />
                <InfoRow label={t('dashboard.info.fax')} value={currentGroup?.faxCount || 0} />
                <InfoRow
                  label={t('dashboard.info.credit')}
                  value={`${(currentGroup?.creditThreshold || 0).toFixed(2)} €`}
                  className="credit"
                />
              </Tile>

              {/* Tile: Consommation */}
              <Tile title={t('dashboard.consumption.title')}>
                <ConsumptionCircle percentage={consumptionPercentage} outplanAmount={outplanAmount} />
              </Tile>
            </div>

            {/* Table: Derniers relevés */}
            <div className="voip-table-container">
              <div className="voip-table-title">{t('dashboard.history.title')}</div>
              <table className="voip-table">
                <thead>
                  <tr>
                    <th>{t('dashboard.history.date')}</th>
                    <th>{t('dashboard.history.amount')}</th>
                    <th>{t('dashboard.history.paid')}</th>
                    <th>{t('dashboard.history.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {consumption.map((item, i) => (
                    <tr key={i}>
                      <td>{new Date(item.date).toLocaleDateString('fr-FR')}</td>
                      <td>{item.price.value.toFixed(2)} €</td>
                      <td className={item.status === 'paid' ? 'success' : ''}>
                        {item.status === 'paid' ? t('dashboard.history.yes') : t('dashboard.history.no')}
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
                        {t('dashboard.history.empty')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Parc VoIP */}
            <div className="voip-table-container">
              <div className="voip-table-title">{t('dashboard.phones.title')}</div>
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
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{t('dashboard.phones.empty')}</div>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'services':
        return (
          <EmptyState
            icon="📋"
            title={t('tabs.services')}
            description={t('placeholder.services')}
          />
        );

      case 'phonebook':
        return (
          <EmptyState
            icon="📒"
            title={t('tabs.phonebook')}
            description={t('placeholder.phonebook')}
          />
        );

      case 'billing':
        return (
          <EmptyState
            icon="💰"
            title={t('tabs.billing')}
            description={t('placeholder.billing')}
          />
        );

      case 'admin':
        return (
          <EmptyState
            icon="⚙️"
            title={t('tabs.admin')}
            description={t('placeholder.admin')}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="voip-layout">
      {/* Left Panel */}
      <LeftPanel
        groups={groups}
        selectedId={selectedGroup}
        onSelect={setSelectedGroup}
        loading={loading}
        smsAccounts={smsAccounts}
        faxServices={faxServices}
      />

      {/* Right Panel */}
      {currentGroup ? (
        <RightPanel
          title={currentGroup.description || currentGroup.billingAccount}
          subtitle={currentGroup.billingAccount}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(id) => setActiveTab(id as GroupTabId)}
          loading={loading}
          actions={
            <button className="btn btn-primary">+ {t('actions.order')}</button>
          }
        >
          {renderTabContent()}
        </RightPanel>
      ) : (
        <div className="voip-right-panel">
          <div className="voip-loading">
            <div className="voip-loading-spinner" />
          </div>
        </div>
      )}
    </div>
  );
}
