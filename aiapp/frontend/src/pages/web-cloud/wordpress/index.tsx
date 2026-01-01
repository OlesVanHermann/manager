// ============================================================
// WORDPRESS - Page principale
// Architecture alignée sur OLD_MANAGER: Resource -> Website[]
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { wordpressApi } from './wordpress.api';
import type {
  ManagedWordpressResource,
  ManagedWordpressWebsiteDetails,
  WordPress,
} from './wordpress.types';
import { GeneralTab, DomainsTab, PerformanceTab, ExtensionsTab, BackupsTab, TasksTab } from './tabs.ts';
import { CreateWebsiteModal } from './CreateWebsiteModal';
import { ImportWebsiteModal } from './ImportWebsiteModal';
import Onboarding from './Onboarding';
import './wordpress.css';

// Structure locale pour le panneau gauche
interface WebsiteListItem {
  id: string;
  resourceId: string;
  fqdn: string;
  status: string;
  phpVersion: string;
  plan: string;
}

type TabKey = 'general' | 'domains' | 'performance' | 'extensions' | 'backups' | 'tasks';

const TABS: { key: TabKey; labelKey: string }[] = [
  { key: 'general', labelKey: 'tabs.general' },
  { key: 'domains', labelKey: 'tabs.domains' },
  { key: 'performance', labelKey: 'tabs.performance' },
  { key: 'extensions', labelKey: 'tabs.extensions' },
  { key: 'backups', labelKey: 'tabs.backups' },
  { key: 'tasks', labelKey: 'tabs.tasks' },
];

export default function WordPressPage() {
  const { t } = useTranslation('web-cloud/wordpress/index');
  const { serviceName: _paramServiceName } = useParams<{ serviceName?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  // State pour les resources et websites
  const [resources, setResources] = useState<ManagedWordpressResource[]>([]);
  const [websites, setWebsites] = useState<WebsiteListItem[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<WebsiteListItem | null>(null);
  const [websiteDetails, setWebsiteDetails] = useState<ManagedWordpressWebsiteDetails | null>(null);
  const [currentResource, setCurrentResource] = useState<ManagedWordpressResource | null>(null);

  // State UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>((searchParams.get('tab') as TabKey) || 'general');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les resources et leurs websites
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Charger toutes les resources
      const resourceList = await wordpressApi.listResources();
      setResources(resourceList);

      // 2. Pour chaque resource, charger les websites
      const allWebsites: WebsiteListItem[] = [];
      for (const resource of resourceList) {
        try {
          const websiteList = await wordpressApi.listAllWebsites(resource.id);
          for (const website of websiteList) {
            allWebsites.push({
              id: website.id,
              resourceId: resource.id,
              fqdn: website.currentState.defaultFQDN || 'En cours de création...',
              status: website.resourceStatus,
              phpVersion: website.currentState.phpVersion,
              plan: resource.currentState.plan.replace('managed-cms-alpha-', '').replace('managed-cms-', ''),
            });
          }
        } catch {
          // Ignorer les erreurs pour une resource individuelle
        }
      }
      setWebsites(allWebsites);

      // 3. Sélectionner le premier website si aucun n'est sélectionné
      if (allWebsites.length > 0 && !selectedWebsite) {
        const firstWebsite = allWebsites[0];
        setSelectedWebsite(firstWebsite);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [selectedWebsite]);

  // Charger les détails du website sélectionné
  const loadWebsiteDetails = useCallback(async () => {
    if (!selectedWebsite) {
      setWebsiteDetails(null);
      setCurrentResource(null);
      return;
    }

    try {
      const [details, resource] = await Promise.all([
        wordpressApi.getWebsite(selectedWebsite.resourceId, selectedWebsite.id),
        wordpressApi.getResource(selectedWebsite.resourceId),
      ]);
      setWebsiteDetails(details);
      setCurrentResource(resource);
    } catch (err) {
      console.error('Erreur chargement détails:', err);
    }
  }, [selectedWebsite]);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { loadWebsiteDetails(); }, [loadWebsiteDetails]);
  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && TABS.some(t => t.key === tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleRefresh = () => {
    loadWebsiteDetails();
  };

  const handleSelectWebsite = (website: WebsiteListItem) => {
    setSelectedWebsite(website);
    setActiveTab('general');
    setSearchParams({ tab: 'general' });
  };

  // Filtre de recherche
  const filteredWebsites = websites.filter(ws =>
    ws.fqdn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Flag pour afficher onboarding
  const showOnboarding = !loading && websites.length === 0;
  const showError = error && websites.length === 0;

  // Convertir pour les tabs legacy
  const legacyDetails: WordPress | null = websiteDetails && currentResource
    ? {
        serviceName: websiteDetails.id,
        displayName: websiteDetails.currentState.defaultFQDN,
        state: mapStatus(websiteDetails.resourceStatus),
        offer: currentResource.currentState.plan.replace('managed-cms-alpha-', '').replace('managed-cms-', ''),
        datacenter: 'gra',
        url: `https://${websiteDetails.currentState.defaultFQDN}`,
        adminUrl: `https://${websiteDetails.currentState.defaultFQDN}/wp-admin`,
        phpVersion: websiteDetails.currentState.phpVersion,
        wordpressVersion: websiteDetails.currentState.import?.checkResult?.cmsSpecific?.wordpress?.version,
        creationDate: websiteDetails.currentState.createdAt,
        sslEnabled: true,
        cdnEnabled: false,
        autoUpdate: true,
        updateAvailable: false,
      }
    : null;

  const renderTab = () => {
    if (!selectedWebsite || !legacyDetails) return null;
    // Passer resourceId ET websiteId pour les actions
    const serviceName = selectedWebsite.resourceId;
    const websiteId = selectedWebsite.id;

    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            serviceName={serviceName}
            websiteId={websiteId}
            details={legacyDetails}
            onRefresh={handleRefresh}
          />
        );
      case 'domains':
        return <DomainsTab serviceName={serviceName} />;
      case 'performance':
        return <PerformanceTab serviceName={serviceName} offer={legacyDetails.offer} />;
      case 'extensions':
        return <ExtensionsTab serviceName={serviceName} />;
      case 'backups':
        return <BackupsTab serviceName={serviceName} offer={legacyDetails.offer} />;
      case 'tasks':
        return <TasksTab serviceName={serviceName} />;
      default:
        return null;
    }
  };

  const getStateInfo = (status: string) => {
    const states: Record<string, { label: string; color: string; className: string }> = {
      READY: { label: t('states.active'), color: '#10B981', className: 'success' },
      CREATING: { label: t('states.creating'), color: '#F59E0B', className: 'warning' },
      UPDATING: { label: t('states.updating'), color: '#F59E0B', className: 'warning' },
      DELETING: { label: t('states.deleting'), color: '#F59E0B', className: 'warning' },
      ERROR: { label: t('states.error'), color: '#EF4444', className: 'error' },
    };
    return states[status] || { label: status, color: '#6B7280', className: 'muted' };
  };

  return (
    <div className="wp-page">
      <div className="wp-split">
        {/* LEFT PANEL - Liste des websites */}
        <aside className="wp-sidebar">
          {/* NAV3 Selector - Un seul groupe "Général" */}
          <div className="wp-nav3-selector">
            <button className="wp-nav3-btn active">
              {t('nav3.general')}
            </button>
          </div>
          <div className="wp-sidebar-search">
            <div className="wp-search-wrapper">
              <span className="wp-search-icon">🔍</span>
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={showOnboarding}
              />
            </div>
          </div>
          <div className="wp-sidebar-filter">
            <span>{filteredWebsites.length} {t('common.sites', { count: filteredWebsites.length })}</span>
          </div>
          <div className="wp-service-items">
            {showOnboarding ? (
              <div className="wp-sidebar-empty">
                <span className="wp-sidebar-empty-icon">📭</span>
                <span className="wp-sidebar-empty-text">{t('noResults')}</span>
              </div>
            ) : (
              filteredWebsites.map(ws => {
                const stateInfo = getStateInfo(ws.status);
                const isSelected = selectedWebsite?.id === ws.id;
                return (
                  <div
                    key={ws.id}
                    className={`wp-service-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectWebsite(ws)}
                  >
                    <span className="wp-service-icon">🌐</span>
                    <div className="wp-service-info">
                      <div className="wp-service-name">{ws.fqdn}</div>
                      <div className="wp-service-version">PHP {ws.phpVersion}</div>
                      <div className="wp-service-state">
                        <span className="wp-state-dot" style={{ backgroundColor: stateInfo.color }} />
                        <span>{stateInfo.label}</span>
                      </div>
                      <div className="wp-service-offer">{ws.plan} sites</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="wp-sidebar-actions">
            <button
              className="wp-btn wp-btn-primary wp-btn-block"
              onClick={() => setShowCreateModal(true)}
              disabled={resources.length === 0}
            >
              + {t('actions.newSite')}
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL - Toujours afficher header + NAV3 */}
        <main className="wp-main">
          <div className="wp-detail">
            {/* Header - Titre dynamique selon sélection */}
            <div className="wp-detail-header">
              <div className="wp-detail-header-info">
                {selectedWebsite && legacyDetails ? (
                  <>
                    <h2>{legacyDetails.displayName || selectedWebsite.fqdn}</h2>
                    <span className="wp-detail-header-meta">
                      PHP {legacyDetails.phpVersion} · {selectedWebsite.plan} sites
                    </span>
                  </>
                ) : (
                  <>
                    <h2>{t('title')}</h2>
                    <span className="wp-detail-header-meta">{t('subtitle')}</span>
                  </>
                )}
              </div>
              {selectedWebsite && legacyDetails && (
                <div className="wp-detail-header-actions">
                  <button
                    className="wp-btn wp-btn-outline"
                    onClick={() => window.open(legacyDetails.adminUrl, '_blank')}
                  >
                    Admin WP
                  </button>
                  <button
                    className="wp-btn wp-btn-outline"
                    onClick={() => window.open(legacyDetails.url, '_blank')}
                  >
                    {t('actions.visitSite')}
                  </button>
                </div>
              )}
            </div>

            {/* NAV4 Fonction - Tabs dans le RIGHT PANEL */}
            <div className="wp-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`wp-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {t(tab.labelKey)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="wp-tab-content">
              {loading ? (
                <div className="wp-page-loading">{t('common.loading')}</div>
              ) : !selectedWebsite ? (
                activeTab === 'general' ? (
                  <Onboarding
                    onCreate={() => setShowCreateModal(true)}
                    onImport={() => setShowImportModal(true)}
                  />
                ) : null
              ) : showError ? (
                <div className="wp-page-error">{error}</div>
              ) : legacyDetails ? (
                renderTab()
              ) : null}
            </div>
          </div>
        </main>
      </div>

      {/* Modales */}
      <CreateWebsiteModal
        serviceName={resources[0]?.id || ''}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadData();
        }}
      />
      <ImportWebsiteModal
        serviceName={resources[0]?.id || ''}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => {
          setShowImportModal(false);
          loadData();
        }}
      />
    </div>
  );
}

function mapStatus(status: string): 'active' | 'creating' | 'deleting' | 'error' | 'updating' {
  const map: Record<string, 'active' | 'creating' | 'deleting' | 'error' | 'updating'> = {
    READY: 'active',
    CREATING: 'creating',
    DELETING: 'deleting',
    ERROR: 'error',
    UPDATING: 'updating',
  };
  return map[status] || 'active';
}
