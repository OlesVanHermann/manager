// ============================================================
// WORDPRESS - Page principale
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../services/api';
import type { WordPress } from './wordpress.types';
import { GeneralTab, DomainsTab, PerformanceTab, ExtensionsTab, BackupsTab, TasksTab } from './tabs';
import { CreateWebsiteModal } from './modals/CreateWebsiteModal';
import { ImportWebsiteModal } from './modals/ImportWebsiteModal';
import Onboarding from './Onboarding';
import './wordpress.css';

const BASE_PATH = '/managedCMS/resource';
const API_OPTIONS = { apiVersion: 'v2' as const };

// Service local pour la page principale
const pageService = {
  async listServices(): Promise<string[]> {
    const response = await apiClient.get<{ serviceName: string }[]>(BASE_PATH, API_OPTIONS);
    return response.map(r => r.serviceName);
  },
  async getService(serviceName: string): Promise<WordPress> {
    return apiClient.get(`${BASE_PATH}/${serviceName}`, API_OPTIONS);
  },
};

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
  const { serviceName: paramServiceName } = useParams<{ serviceName?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(paramServiceName || null);
  const [details, setDetails] = useState<WordPress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>((searchParams.get('tab') as TabKey) || 'general');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const list = await pageService.listServices();
      setServices(list);
      if (list.length > 0 && !selectedService) setSelectedService(list[0]);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [selectedService]);

  const loadDetails = useCallback(async () => {
    if (!selectedService) return;
    try {
      const data = await pageService.getService(selectedService);
      setDetails(data);
    } catch (err) {
      console.error(err);
    }
  }, [selectedService]);

  useEffect(() => { loadServices(); }, [loadServices]);
  useEffect(() => { loadDetails(); }, [loadDetails]);
  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && TABS.some(t => t.key === tab)) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };
  const handleRefresh = () => { loadDetails(); };
  const handleSelectService = (svc: string) => {
    setSelectedService(svc);
    setActiveTab('general');
    setSearchParams({ tab: 'general' });
  };

  // Filtre de recherche
  const filteredServices = services.filter(svc =>
    svc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Onboarding si aucun service
  if (!loading && services.length === 0) {
    return (
      <>
        <Onboarding onCreate={() => setShowCreateModal(true)} onImport={() => setShowImportModal(true)} />
        <CreateWebsiteModal serviceName="" isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={() => { setShowCreateModal(false); loadServices(); }} />
        <ImportWebsiteModal serviceName="" isOpen={showImportModal} onClose={() => setShowImportModal(false)} onSuccess={() => { setShowImportModal(false); loadServices(); }} />
      </>
    );
  }

  const renderTab = () => {
    if (!selectedService || !details) return null;
    switch (activeTab) {
      case 'general': return <GeneralTab serviceName={selectedService} details={details} onRefresh={handleRefresh} />;
      case 'domains': return <DomainsTab serviceName={selectedService} />;
      case 'performance': return <PerformanceTab serviceName={selectedService} offer={details.offer} />;
      case 'extensions': return <ExtensionsTab serviceName={selectedService} />;
      case 'backups': return <BackupsTab serviceName={selectedService} offer={details.offer} />;
      case 'tasks': return <TasksTab serviceName={selectedService} />;
      default: return null;
    }
  };

  // Etat du site pour l'affichage
  const getStateInfo = (state: string) => {
    const states: Record<string, { label: string; color: string; className: string }> = {
      active: { label: t('states.active'), color: '#10B981', className: 'success' },
      installing: { label: t('states.installing'), color: '#F59E0B', className: 'warning' },
      updating: { label: t('states.updating'), color: '#F59E0B', className: 'warning' },
      suspended: { label: t('states.suspended'), color: '#EF4444', className: 'error' },
      error: { label: t('states.error'), color: '#EF4444', className: 'error' },
      creating: { label: t('states.creating'), color: '#F59E0B', className: 'warning' },
      deleting: { label: t('states.deleting'), color: '#F59E0B', className: 'warning' },
      importing: { label: t('states.importing'), color: '#F59E0B', className: 'warning' },
    };
    return states[state] || { label: state, color: '#6B7280', className: 'muted' };
  };

  return (
    <div className="wordpress-page">
      <div className="wordpress-split">
        {/* LEFT PANEL - Liste des sites */}
        <aside className="service-list-sidebar">
          <div className="sidebar-search">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sidebar-filter">
            <span>{filteredServices.length} {t('common.sites', { count: filteredServices.length })}</span>
          </div>
          <div className="service-items">
            {filteredServices.map(svc => {
              const svcDetails = svc === selectedService ? details : null;
              const stateInfo = svcDetails ? getStateInfo(svcDetails.state) : null;
              return (
                <div
                  key={svc}
                  className={`service-item ${svc === selectedService ? 'selected' : ''}`}
                  onClick={() => handleSelectService(svc)}
                >
                  <span className="service-icon">🌐</span>
                  <div className="service-info">
                    <div className="service-item-name">{svcDetails?.displayName || svc}</div>
                    <div className="service-item-version">WordPress {svcDetails?.wordpressVersion || svcDetails?.wpVersion || '--'}</div>
                    {stateInfo && (
                      <div className="service-item-state">
                        <span className="state-dot" style={{ backgroundColor: stateInfo.color }} />
                        <span>{stateInfo.label}</span>
                      </div>
                    )}
                    <div className="service-item-offer">{svcDetails?.offer || 'WordPress'} · {svcDetails?.datacenter || '--'}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="sidebar-actions">
            <button className="btn btn-primary btn-block" onClick={() => setShowCreateModal(true)}>
              + {t('actions.newSite')}
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL - Details du site */}
        <main className="wordpress-main">
          {loading ? (
            <div className="mwp-page-loading">{t('common.loading')}</div>
          ) : error ? (
            <div className="mwp-page-error">{error}</div>
          ) : selectedService && details ? (
            <div className="service-detail">
              {/* Header */}
              <div className="detail-header">
                <div className="detail-header-info">
                  <h2>{details.displayName || details.serviceName}</h2>
                  <span className="detail-header-meta">
                    WordPress {details.wordpressVersion || details.wpVersion} · PHP {details.phpVersion} · {details.offer}
                  </span>
                </div>
                <div className="detail-header-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => window.open(details.adminUrl || `${details.url}/wp-admin`, '_blank')}
                  >
                    Admin WP
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => window.open(details.url, '_blank')}
                  >
                    {t('actions.visitSite')}
                  </button>
                </div>
              </div>

              {/* NAV3 Tabs */}
              <div className="detail-header-tabs">
                {TABS.map(tab => (
                  <button
                    key={tab.key}
                    className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    {t(tab.labelKey)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="tab-content">{renderTab()}</div>
            </div>
          ) : (
            <div className="wordpress-empty">
              <span className="empty-icon">🌐</span>
              <h3>{t('common.selectService')}</h3>
            </div>
          )}
        </main>
      </div>

      {/* Modales */}
      <CreateWebsiteModal
        serviceName={selectedService || ''}
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => { setShowCreateModal(false); loadServices(); }}
      />
      <ImportWebsiteModal
        serviceName={selectedService || ''}
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => { setShowImportModal(false); loadServices(); }}
      />
    </div>
  );
}
