// ============================================================
// FAX PANEL - Wrapper pour l'intégration dans l'index unifié
// NAV4: Général, Campagnes, Consommation, Paramètres, Logo
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../../services/api';

// Imports des tabs
import { GeneralTab } from './GeneralTab';
import { CampaignsTab } from './campaigns/CampaignsTab';
import { ConsumptionTab } from './consumption/ConsumptionTab';
import { SettingsTab } from './settings/SettingsTab';
import { LogoTab } from './logo/LogoTab';

type FaxTabId = 'general' | 'campaigns' | 'consumption' | 'settings' | 'logo';

interface FaxPanelProps {
  serviceName: string;
  title: string;
  subtitle: string;
}

interface FreefaxDetails {
  number: string;
  fromName: string;
  faxMaxCall: number;
  fromEmail: string;
}

const faxPanelService = {
  async getFreefax(serviceName: string): Promise<FreefaxDetails> {
    return ovhApi.get<FreefaxDetails>(`/freefax/${serviceName}`);
  },
};

export function FaxPanel({ serviceName, title, subtitle }: FaxPanelProps) {
  const { t } = useTranslation('web-cloud/voip/fax/index');

  // State
  const [faxDetails, setFaxDetails] = useState<FreefaxDetails | null>(null);
  const [activeTab, setActiveTab] = useState<FaxTabId>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du service FAX
  useEffect(() => {
    // Si pas de serviceName, on affiche quand même les tabs avec un état vide
    if (!serviceName) {
      setLoading(false);
      setFaxDetails(null);
      return;
    }

    const loadFax = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await faxPanelService.getFreefax(serviceName);
        setFaxDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    loadFax();
  }, [serviceName]);

  // Définition des tabs NAV4 (labels en dur car traductions pas encore créées)
  const tabs: Array<{ id: FaxTabId; label: string }> = [
    { id: 'general', label: 'Général' },
    { id: 'campaigns', label: 'Campagnes' },
    { id: 'consumption', label: 'Consommation' },
    { id: 'settings', label: 'Paramètres' },
    { id: 'logo', label: 'Logo' },
  ];

  // Rendu de l'état vide
  const renderEmptyState = () => (
    <div className="fax-panel-empty">
      <div className="fax-panel-empty-icon">📠</div>
      <div className="fax-panel-empty-title">Aucun service FAX</div>
      <div className="fax-panel-empty-description">
        Sélectionnez un service dans la liste ou souscrivez à une offre Freefax.
      </div>
    </div>
  );

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    // Si pas de service sélectionné, afficher état vide
    if (!serviceName) {
      return renderEmptyState();
    }

    switch (activeTab) {
      case 'general':
        return <GeneralTab serviceName={serviceName} />;
      case 'campaigns':
        return <CampaignsTab serviceName={serviceName} />;
      case 'consumption':
        return <ConsumptionTab serviceName={serviceName} />;
      case 'settings':
        return <SettingsTab serviceName={serviceName} />;
      case 'logo':
        return <LogoTab serviceName={serviceName} />;
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
          <h1>{faxDetails?.fromName || title}</h1>
          <p>{faxDetails?.number || subtitle}</p>
        </div>
        <div className="voip-right-panel-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab('campaigns')}
            disabled={!serviceName}
          >
            + {t('actions.sendFax') || 'Envoyer'}
          </button>
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

export default FaxPanel;
