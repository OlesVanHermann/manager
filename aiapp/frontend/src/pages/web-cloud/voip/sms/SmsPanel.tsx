// ============================================================
// SMS PANEL - Wrapper pour l'intégration dans l'index unifié
// NAV4: Général, Envoyer, Campagnes, Sortants, Entrants, Expéditeurs, Modèles
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ovhApi } from '../../../../services/api';
import type { SmsAccount } from './sms.types';

// Imports des tabs
import { GeneralTab } from './GeneralTab';
import { SendTab } from './send/SendTab';
import { CampaignsTab } from './campaigns/CampaignsTab';
import { OutgoingTab } from './outgoing/OutgoingTab';
import { IncomingTab } from './incoming/IncomingTab';
import { SendersTab } from './senders/SendersTab';
import { TemplatesTab } from './templates/TemplatesTab';

type SmsTabId = 'general' | 'send' | 'campaigns' | 'outgoing' | 'incoming' | 'senders' | 'templates';

interface SmsPanelProps {
  accountName: string;
  title: string;
  subtitle: string;
}

const smsPanelService = {
  async getSmsAccount(serviceName: string): Promise<SmsAccount> {
    return ovhApi.get<SmsAccount>(`/sms/${serviceName}`);
  },
};

export function SmsPanel({ accountName, title, subtitle }: SmsPanelProps) {
  const { t } = useTranslation('web-cloud/voip/sms/index');

  // State
  const [account, setAccount] = useState<SmsAccount | null>(null);
  const [activeTab, setActiveTab] = useState<SmsTabId>('general');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du compte SMS
  useEffect(() => {
    // Si pas de accountName, on affiche quand même les tabs avec un état vide
    if (!accountName) {
      setLoading(false);
      setAccount(null);
      return;
    }

    const loadAccount = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await smsPanelService.getSmsAccount(accountName);
        setAccount(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };
    loadAccount();
  }, [accountName]);

  // Définition des tabs NAV4 (labels en dur car traductions pas encore créées)
  const tabs: Array<{ id: SmsTabId; label: string }> = [
    { id: 'general', label: 'Général' },
    { id: 'send', label: 'Envoyer' },
    { id: 'campaigns', label: 'Campagnes' },
    { id: 'outgoing', label: 'Sortants' },
    { id: 'incoming', label: 'Entrants' },
    { id: 'senders', label: 'Expéditeurs' },
    { id: 'templates', label: 'Modèles' },
  ];

  // Rendu de l'état vide
  const renderEmptyState = () => (
    <div className="sms-panel-empty">
      <div className="sms-panel-empty-icon">📱</div>
      <div className="sms-panel-empty-title">Aucun service SMS</div>
      <div className="sms-panel-empty-description">
        Sélectionnez un service dans la liste ou souscrivez à une offre SMS.
      </div>
    </div>
  );

  // Rendu du contenu selon l'onglet actif
  const renderTabContent = () => {
    // Si pas de service sélectionné, afficher état vide
    if (!accountName) {
      return renderEmptyState();
    }

    switch (activeTab) {
      case 'general':
        return <GeneralTab accountName={accountName} />;
      case 'send':
        return <SendTab accountName={accountName} />;
      case 'campaigns':
        return <CampaignsTab accountName={accountName} />;
      case 'outgoing':
        return <OutgoingTab accountName={accountName} />;
      case 'incoming':
        return <IncomingTab accountName={accountName} />;
      case 'senders':
        return <SendersTab accountName={accountName} />;
      case 'templates':
        return <TemplatesTab accountName={accountName} />;
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
          <h1>{account?.description || title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="voip-right-panel-header-actions">
          {account && (
            <div className="sms-credits-badge">
              <span className="sms-credits-value">{account.creditsLeft.toLocaleString('fr-FR')}</span>
              <span className="sms-credits-label">{t('credits') || 'crédits'}</span>
            </div>
          )}
          <button
            className="btn btn-primary"
            onClick={() => window.open('https://www.ovhtelecom.fr/sms/', '_blank')}
          >
            + {t('actions.buyCredits') || 'Acheter'}
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

export default SmsPanel;
