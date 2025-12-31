// ============================================================
// LINES INDEX - Page ligne VoIP avec 7 tabs
// Target: target_.web-cloud.voip.line.*.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { linesService } from './lines.service';
import { RightPanel, EmptyState } from '../components/RightPanel';
import type { TelephonyLine, TelephonyPhone } from '../voip.types';
import type { LineTabId, LineServiceInfos } from './lines.types';

// Imports des tabs
import { DashboardTab } from './tabs/dashboard/DashboardTab';
import { GeneralTab } from './tabs/general/GeneralTab';
import { PhoneTab } from './tabs/phone/PhoneTab';
import { OptionsTab } from './tabs/options/OptionsTab';
import { ConsumptionTab } from './tabs/consumption/ConsumptionTab';
import { CallsTab } from './tabs/calls/CallsTab';
import { Click2CallTab } from './tabs/click2call/Click2CallTab';
import { ForwardTab } from './tabs/forward/ForwardTab';
import { VoicemailTab } from './tabs/voicemail/VoicemailTab';

interface LinePageProps {
  billingAccount?: string;
  serviceName?: string;
}

export default function LinePage({
  billingAccount: propBillingAccount,
  serviceName: propServiceName,
}: LinePageProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/lines/index');
  const params = useParams<{ billingAccount: string; serviceName: string }>();
  const billingAccount = propBillingAccount || params.billingAccount;
  const serviceName = propServiceName || params.serviceName;

  // State
  const [line, setLine] = useState<TelephonyLine | null>(null);
  const [phone, setPhone] = useState<TelephonyPhone | null>(null);
  const [serviceInfos, setServiceInfos] = useState<LineServiceInfos | null>(null);
  const [activeTab, setActiveTab] = useState<LineTabId>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de la ligne
  useEffect(() => {
    if (!billingAccount || !serviceName) return;

    const loadLine = async () => {
      try {
        setLoading(true);
        setError(null);
        const [lineData, phoneData, serviceData] = await Promise.all([
          linesService.getLine(billingAccount, serviceName),
          linesService.getPhone(billingAccount, serviceName),
          linesService.getServiceInfos(billingAccount, serviceName).catch(() => null),
        ]);
        setLine(lineData);
        setPhone(phoneData);
        setServiceInfos(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.loading'));
      } finally {
        setLoading(false);
      }
    };
    loadLine();
  }, [billingAccount, serviceName, t]);

  // Définition des tabs
  const tabs = [
    { id: 'dashboard' as const, label: t('tabs.dashboard') },
    { id: 'general' as const, label: t('tabs.general') },
    { id: 'phone' as const, label: t('tabs.phone') },
    { id: 'calls' as const, label: t('tabs.calls') },
    { id: 'forward' as const, label: t('tabs.forward') },
    { id: 'voicemail' as const, label: t('tabs.voicemail') },
    { id: 'consumption' as const, label: t('tabs.consumption') },
    { id: 'options' as const, label: t('tabs.options') },
  ];

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    if (!billingAccount || !serviceName || !line) return null;

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            line={line}
            phone={phone}
          />
        );
      case 'general':
        return (
          <GeneralTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            line={line}
            serviceInfos={serviceInfos}
            onUpdate={(updated) => setLine(updated)}
          />
        );
      case 'phone':
        return (
          <PhoneTab
            billingAccount={billingAccount}
            serviceName={serviceName}
            phone={phone}
            onUpdate={(updated) => setPhone(updated)}
          />
        );
      case 'options':
        return <OptionsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'consumption':
        return <ConsumptionTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'calls':
        return <CallsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'click2call':
        return <Click2CallTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'forward':
        return <ForwardTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'voicemail':
        return <VoicemailTab billingAccount={billingAccount} serviceName={serviceName} />;
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
      title={line?.description || serviceName || ''}
      subtitle={serviceName}
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(id) => setActiveTab(id as LineTabId)}
      loading={loading}
      actions={
        <button className="btn btn-primary">{t('actions.call')}</button>
      }
    >
      {renderTabContent()}
    </RightPanel>
  );
}

// Export nommé pour compatibilité
export { LinePage };
