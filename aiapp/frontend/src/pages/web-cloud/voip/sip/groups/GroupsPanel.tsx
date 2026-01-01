// ============================================================
// VOIP GROUPS PANEL - Wrapper pour l'intégration dans l'index unifié
// NAV4: Dashboard, Général, Services, Orders, Portability, Billing, Repayments, Security
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { groupsService } from './groups.service';
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

interface VoipGroupsPanelProps {
  billingAccount: string;
  title: string;
  subtitle: string;
}

export function VoipGroupsPanel({ billingAccount, title, subtitle }: VoipGroupsPanelProps) {
  const { t } = useTranslation('web-cloud/voip/groups/index');

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

  // Définition des tabs NAV4
  const tabs: Array<{ id: GroupTabId; label: string }> = [
    { id: 'dashboard', label: t('tabs.dashboard') },
    { id: 'general', label: t('tabs.general') },
    { id: 'services', label: t('tabs.services') },
    { id: 'orders', label: t('tabs.orders') },
    { id: 'portability', label: t('tabs.portability') },
    { id: 'billing', label: t('tabs.billing') },
    { id: 'repayments', label: t('tabs.repayments') },
    { id: 'security', label: t('tabs.security') },
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

  if (loading) {
    return (
      <>
        <div className="voip-right-panel-header">
          <div className="voip-right-panel-header-info">
            <div className="voip-skeleton" style={{ width: 200, height: 24, marginBottom: 8 }} />
            <div className="voip-skeleton" style={{ width: 150, height: 16 }} />
          </div>
        </div>
        <div className="voip-right-panel-tabs">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="voip-skeleton" style={{ width: 80, height: 26 }} />
          ))}
        </div>
        <div className="voip-right-panel-content">
          <div className="voip-tiles-row">
            {[1, 2, 3].map((i) => (
              <div key={i} className="voip-skeleton voip-skeleton-tile" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="voip-empty-state">
        <div className="voip-empty-state-icon">❌</div>
        <div className="voip-empty-state-title">{t('error.title')}</div>
        <div className="voip-empty-state-description">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="voip-right-panel-header">
        <div className="voip-right-panel-header-info">
          <h1>{group?.description || title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="voip-right-panel-header-actions">
          <button className="btn btn-primary">+ {t('actions.order')}</button>
        </div>
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
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="voip-right-panel-content">{renderTabContent()}</div>
    </>
  );
}

export default VoipGroupsPanel;
