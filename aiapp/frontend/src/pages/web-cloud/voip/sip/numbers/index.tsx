// ============================================================
// NUMBERS INDEX - Page numéro VoIP avec 8 tabs
// Target: target_.web-cloud.voip.number.*.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { numbersService } from './numbers.service';
import { RightPanel, EmptyState } from './RightPanel';
import type { TelephonyNumber } from '../voip.types';
import type { NumberTabId, NumberServiceInfos } from './numbers.types';

// Imports des tabs
import { DashboardTab } from './dashboard/DashboardTab';
import { GeneralTab } from './GeneralTab';
import { ConfigurationTab } from './configuration/ConfigurationTab';
import { CallsTab } from './calls/CallsTab';
import { ConsumptionTab } from './consumption/ConsumptionTab';
import { SchedulerTab } from './scheduler/SchedulerTab';
import { OptionsTab } from './options/OptionsTab';
import { RecordsTab } from './records/RecordsTab';
import { AgentsTab } from './agents/AgentsTab';
import { DdiTab } from './ddi/DdiTab';
import { SoundsTab } from './sounds/SoundsTab';
import { StatsTab } from './stats/StatsTab';
import { SviTab } from './svi/SviTab';

interface NumberPageProps {
  billingAccount?: string;
  serviceName?: string;
}

export default function NumberPage({
  billingAccount: propBillingAccount,
  serviceName: propServiceName,
}: NumberPageProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/index');
  const params = useParams<{ billingAccount: string; serviceName: string }>();
  const billingAccount = propBillingAccount || params.billingAccount;
  const serviceName = propServiceName || params.serviceName;

  // State
  const [number, setNumber] = useState<TelephonyNumber | null>(null);
  const [serviceInfos, setServiceInfos] = useState<NumberServiceInfos | null>(null);
  const [activeTab, setActiveTab] = useState<NumberTabId>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du numéro
  useEffect(() => {
    if (!billingAccount || !serviceName) return;

    const loadNumber = async () => {
      try {
        setLoading(true);
        setError(null);
        const [numberData, serviceData] = await Promise.all([
          numbersService.getNumber(billingAccount, serviceName),
          numbersService.getServiceInfos(billingAccount, serviceName).catch(() => null),
        ]);
        setNumber(numberData);
        setServiceInfos(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.loading'));
      } finally {
        setLoading(false);
      }
    };
    loadNumber();
  }, [billingAccount, serviceName, t]);

  // Définition des tabs
  const tabs = [
    { id: 'dashboard' as const, label: t('tabs.dashboard') },
    { id: 'general' as const, label: t('tabs.general') },
    { id: 'configuration' as const, label: t('tabs.configuration') },
    { id: 'calls' as const, label: t('tabs.calls') },
    { id: 'consumption' as const, label: t('tabs.consumption') },
    { id: 'scheduler' as const, label: t('tabs.scheduler') },
    { id: 'options' as const, label: t('tabs.options') },
    { id: 'records' as const, label: t('tabs.records') },
    { id: 'agents' as const, label: t('tabs.agents') },
    { id: 'ddi' as const, label: t('tabs.ddi') },
    { id: 'sounds' as const, label: t('tabs.sounds') },
    { id: 'stats' as const, label: t('tabs.stats') },
    { id: 'svi' as const, label: t('tabs.svi') },
  ];

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    if (!billingAccount || !serviceName || !number) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            number={number}
          />
        );
      case 'general':
        return (
          <GeneralTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            number={number}
            serviceInfos={serviceInfos as any}
            onUpdate={(updated) => setNumber(updated)}
          />
        );
      case 'configuration':
        return (
          <ConfigurationTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            number={number}
          />
        );
      case 'calls':
        return <CallsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'consumption':
        return <ConsumptionTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'scheduler':
        return <SchedulerTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'options':
        return <OptionsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'records':
        return <RecordsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'agents':
        return <AgentsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'ddi':
        return <DdiTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'sounds':
        return <SoundsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'stats':
        return <StatsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'svi':
        return <SviTab billingAccount={billingAccount} serviceName={serviceName} />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="voip-right-panel">
        <EmptyState icon="❌" title={t('error.title')} description={error} />
      </div>
    );
  }

  return (
    <RightPanel
      title={number?.description || serviceName || ''}
      subtitle={serviceName}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as NumberTabId)}
      loading={loading}
    >
      {renderTabContent()}
    </RightPanel>
  );
}

// Export nommé pour compatibilité
export { NumberPage };
