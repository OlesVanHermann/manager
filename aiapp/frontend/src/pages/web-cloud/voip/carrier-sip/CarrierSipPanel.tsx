// ============================================================
// CARRIER-SIP PANEL - Wrapper pour l'intégration dans l'index unifié
// NAV4: Général, CDR, Endpoints, Routing, Settings
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generalService } from './GeneralTab.service';
import type { CarrierSip } from './carrier-sip.types';

// Imports des tabs
import { GeneralTab } from './GeneralTab';
import { CdrTab } from './cdr/CdrTab';
import { EndpointsTab } from './endpoints/EndpointsTab';
import { RoutingTab } from './routing/RoutingTab';
import { SettingsTab } from './settings/SettingsTab';

type CarrierSipTabId = 'general' | 'cdr' | 'endpoints' | 'routing' | 'settings';

interface CarrierSipPanelProps {
  billingAccount: string;
  serviceName: string;
  title: string;
  subtitle: string;
}

export function CarrierSipPanel({ billingAccount, serviceName, title, subtitle }: CarrierSipPanelProps) {
  const { t } = useTranslation('web-cloud/voip/carrier-sip/index');

  // State
  const [details, setDetails] = useState<CarrierSip | null>(null);
  const [activeTab, setActiveTab] = useState<CarrierSipTabId>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du service Carrier-SIP
  useEffect(() => {
    // Si pas de billingAccount ou serviceName, on affiche quand même les tabs avec un état vide
    if (!billingAccount || !serviceName) {
      setLoading(false);
      setDetails(null);
      return;
    }

    const loadCarrier = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await generalService.getCarrierSip(billingAccount, serviceName);
        setDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    loadCarrier();
  }, [billingAccount, serviceName]);

  // Définition des tabs NAV4 (labels en dur car traductions pas encore créées)
  const tabs: Array<{ id: CarrierSipTabId; label: string }> = [
    { id: 'general', label: 'Général' },
    { id: 'cdr', label: 'CDR' },
    { id: 'endpoints', label: 'Endpoints' },
    { id: 'routing', label: 'Routing' },
    { id: 'settings', label: 'Settings' },
  ];

  // Rendu de l'état vide
  const renderEmptyState = () => (
    <div className="carrier-panel-empty">
      <div className="carrier-panel-empty-icon">🌐</div>
      <div className="carrier-panel-empty-title">Aucun service Carrier SIP</div>
      <div className="carrier-panel-empty-description">
        Sélectionnez un service dans la liste ou souscrivez à une offre Carrier SIP.
      </div>
    </div>
  );

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    // Si pas de service sélectionné, afficher état vide
    if (!billingAccount || !serviceName) {
      return renderEmptyState();
    }

    switch (activeTab) {
      case 'general':
        return <GeneralTab billingAccount={billingAccount} serviceName={serviceName} details={details} />;
      case 'cdr':
        return <CdrTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'endpoints':
        return <EndpointsTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'routing':
        return <RoutingTab billingAccount={billingAccount} serviceName={serviceName} />;
      case 'settings':
        return <SettingsTab billingAccount={billingAccount} serviceName={serviceName} />;
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="voip-skeleton" style={{ width: 80, height: 26 }} />
          ))}
        </div>
        <div className="voip-right-panel-content">
          <div className="voip-tiles-row">
            {[1, 2].map((i) => (
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
        <div className="voip-empty-state-title">{t('error.title') || 'Erreur'}</div>
        <div className="voip-empty-state-description">{error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="voip-right-panel-header">
        <div className="voip-right-panel-header-info">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="voip-right-panel-header-actions">
          {details && (
            <span className={`voip-left-panel-item-badge ${details.status === 'enabled' ? 'success' : 'warning'}`}>
              {details.currentCalls}/{details.maxCalls} {t('calls') || 'appels'}
            </span>
          )}
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

export default CarrierSipPanel;
