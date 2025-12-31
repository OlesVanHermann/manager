// ============================================================
// GROUPS INDEX - Page groupe VoIP avec 8 tabs
// Target: target_.web-cloud.voip.group.*.svg
// ============================================================

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { groupsService } from './groups.service';
import { RightPanel, EmptyState } from './RightPanel';
import type { TelephonyBillingAccount } from '../voip.types';
import type { GroupTabId, GroupServiceInfos } from './groups.types';

// Imports des tabs
import { DashboardTab } from './dashboard/DashboardTab';
import { GeneralTab } from './GeneralTab';
import { ServicesTab } from '../services';
import { OrdersTab } from './orders/OrdersTab';
import { PortabilityTab } from './portability/PortabilityTab';
import { BillingTab } from './billing/BillingTab';
import { RepaymentsTab } from './repayments/RepaymentsTab';
import { SecurityTab } from './security/SecurityTab';

interface GroupPageProps {
  billingAccount?: string;
}

export default function GroupPage({ billingAccount: propBillingAccount }: GroupPageProps) {
  const { t } = useTranslation('web-cloud/voip/groups/index');
  const params = useParams<{ billingAccount: string }>();
  const billingAccount = propBillingAccount || params.billingAccount;

  // State
  const [group, setGroup] = useState<TelephonyBillingAccount | null>(null);
  const [serviceInfos, setServiceInfos] = useState<GroupServiceInfos | null>(null);
  const [activeTab, setActiveTab] = useState<GroupTabId>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du groupe
  useEffect(() => {
    if (!billingAccount) return;

    const loadGroup = async () => {
      try {
        setLoading(true);
        setError(null);
        const [groupData, serviceData] = await Promise.all([
          groupsService.getGroup(billingAccount),
          groupsService.getServiceInfos(billingAccount).catch(() => null),
        ]);
        setGroup(groupData);
        setServiceInfos(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.loading'));
      } finally {
        setLoading(false);
      }
    };
    loadGroup();
  }, [billingAccount, t]);

  // Définition des tabs
  const tabs = [
    { id: 'dashboard' as const, label: t('tabs.dashboard') },
    { id: 'general' as const, label: t('tabs.general') },
    { id: 'services' as const, label: t('tabs.services') },
    { id: 'orders' as const, label: t('tabs.orders') },
    { id: 'portability' as const, label: t('tabs.portability') },
    { id: 'billing' as const, label: t('tabs.billing') },
    { id: 'repayments' as const, label: t('tabs.repayments') },
    { id: 'security' as const, label: t('tabs.security') },
  ];

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    if (!billingAccount || !group) return null;

    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab billingAccount={billingAccount} group={group} />;
      case 'general':
        return (
          <GeneralTab
            billingAccount={billingAccount}
            group={group}
            serviceInfos={serviceInfos as any}
            onUpdate={(updated) => setGroup(updated)}
          />
        );
      case 'services':
        return <ServicesTab billingAccount={billingAccount} />;
      case 'orders':
        return <OrdersTab billingAccount={billingAccount} />;
      case 'portability':
        return <PortabilityTab billingAccount={billingAccount} />;
      case 'billing':
        return <BillingTab billingAccount={billingAccount} />;
      case 'repayments':
        return <RepaymentsTab billingAccount={billingAccount} />;
      case 'security':
        return <SecurityTab billingAccount={billingAccount} />;
      default:
        return null;
    }
  };

  if (error) {
    return (
      <div className="voip-right-panel">
        <EmptyState
          icon="❌"
          title={t('error.title')}
          description={error}
        />
      </div>
    );
  }

  return (
    <RightPanel
      title={group?.description || billingAccount || ''}
      subtitle={billingAccount}
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
  );
}

// Export nommé pour compatibilité
export { GroupPage };
