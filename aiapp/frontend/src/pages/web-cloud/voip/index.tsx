// ============================================================
// VOIP UNIFIED PAGE - NAV3: VoIP / SMS / FAX / Carrier-SIP
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { log } from '../../../services/logger';
import { ovhApi } from '../../../services/api';

// Sub-pages / Panels
import { SipPanel } from './sip/SipPanel';
import { SmsPanel } from './sms/SmsPanel';
import { FaxPanel } from './fax/FaxPanel';
import { CarrierSipPanel } from './carrier-sip/CarrierSipPanel';

import './index.css';

// ============================================================
// TYPES
// ============================================================

type Nav3Type = 'sip' | 'sms' | 'fax' | 'carrier-sip';

interface ServiceItem {
  id: string;
  type: Nav3Type;
  subType?: 'group' | 'line' | 'number' | 'fax-telephony';
  billingAccount?: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeType?: 'success' | 'warning' | 'error';
  counts?: { lines?: number; numbers?: number; fax?: number };
  creditsLeft?: number;
}

interface ServiceCounts {
  sip: number;
  sms: number;
  fax: number;
  carrierSip: number;
}

// ============================================================
// SERVICE
// ============================================================

const voipIndexService = {
  // VoIP Groups
  async listBillingAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/telephony').catch(() => []);
  },

  async getGroupDetails(ba: string): Promise<{
    billingAccount: string;
    description: string;
    status: string;
    linesCount: number;
    numbersCount: number;
    faxCount: number;
  }> {
    const [account, lines, numbers, faxList] = await Promise.all([
      ovhApi.get<{ billingAccount: string; description: string; status: string }>(`/telephony/${ba}`),
      ovhApi.get<string[]>(`/telephony/${ba}/line`).catch(() => []),
      ovhApi.get<string[]>(`/telephony/${ba}/number`).catch(() => []),
      ovhApi.get<string[]>(`/telephony/${ba}/fax`).catch(() => []),
    ]);
    return {
      billingAccount: account.billingAccount,
      description: account.description,
      status: account.status,
      linesCount: lines.length,
      numbersCount: numbers.length,
      faxCount: faxList.length,
    };
  },

  // SMS
  async listSmsAccounts(): Promise<string[]> {
    return ovhApi.get<string[]>('/sms').catch(() => []);
  },

  async getSmsDetails(name: string): Promise<{ name: string; description: string; creditsLeft: number; status: string }> {
    return ovhApi.get(`/sms/${name}`);
  },

  // FAX (standalone freefax)
  async listFreefax(): Promise<string[]> {
    return ovhApi.get<string[]>('/freefax').catch(() => []);
  },

  async getFreefaxDetails(sn: string): Promise<{ number: string; fromName: string }> {
    return ovhApi.get(`/freefax/${sn}`);
  },

  // Carrier-SIP
  async listCarrierSip(): Promise<Array<{ billingAccount: string; serviceName: string }>> {
    const bas = await ovhApi.get<string[]>('/telephony').catch(() => []);
    const results: Array<{ billingAccount: string; serviceName: string }> = [];
    for (const ba of bas) {
      const carriers = await ovhApi.get<string[]>(`/telephony/${ba}/carrierSip`).catch(() => []);
      for (const sn of carriers) {
        results.push({ billingAccount: ba, serviceName: sn });
      }
    }
    return results;
  },
};

// ============================================================
// COMPONENT
// ============================================================

export default function VoipUnifiedPage() {
  const { t } = useTranslation('web-cloud/voip/index');

  // NAV3 State
  const [activeNav3, setActiveNav3] = useState<Nav3Type>('sip');

  // Services data
  const [voipGroups, setVoipGroups] = useState<ServiceItem[]>([]);
  const [smsAccounts, setSmsAccounts] = useState<ServiceItem[]>([]);
  const [faxServices, setFaxServices] = useState<ServiceItem[]>([]);
  const [carrierSipServices, setCarrierSipServices] = useState<ServiceItem[]>([]);

  // Loading / Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected service
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Counts
  const counts: ServiceCounts = useMemo(() => ({
    sip: voipGroups.length,
    sms: smsAccounts.length,
    fax: faxServices.length,
    carrierSip: carrierSipServices.length,
  }), [voipGroups, smsAccounts, faxServices, carrierSipServices]);

  // Logger NAV3
  useEffect(() => {
    log.setNav3(activeNav3);
  }, [activeNav3]);

  // Logger service
  useEffect(() => {
    log.setService(selectedService);
  }, [selectedService]);

  // Load all services on mount
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        setError(null);

        // VoIP Groups
        const bas = await voipIndexService.listBillingAccounts();
        const groupItems: ServiceItem[] = [];
        for (const ba of bas) {
          try {
            const details = await voipIndexService.getGroupDetails(ba);
            groupItems.push({
              id: ba,
              type: 'sip',
              subType: 'group',
              billingAccount: ba,
              title: details.description || ba,
              subtitle: ba,
              badge: details.status === 'enabled' ? t('status.active') : t('status.expired'),
              badgeType: details.status === 'enabled' ? 'success' : 'error',
              counts: {
                lines: details.linesCount,
                numbers: details.numbersCount,
                fax: details.faxCount,
              },
            });
          } catch {
            // skip
          }
        }
        setVoipGroups(groupItems);

        // SMS
        const smsNames = await voipIndexService.listSmsAccounts();
        const smsItems: ServiceItem[] = [];
        for (const name of smsNames) {
          try {
            const details = await voipIndexService.getSmsDetails(name);
            smsItems.push({
              id: name,
              type: 'sms',
              title: details.description || name,
              subtitle: name,
              badge: details.creditsLeft > 0 ? `${details.creditsLeft} crédits` : 'Vide',
              badgeType: details.creditsLeft > 0 ? 'success' : 'warning',
              creditsLeft: details.creditsLeft,
            });
          } catch {
            smsItems.push({
              id: name,
              type: 'sms',
              title: name,
              subtitle: name,
              badge: '-',
              badgeType: 'warning',
            });
          }
        }
        setSmsAccounts(smsItems);

        // FAX (freefax standalone)
        const faxNames = await voipIndexService.listFreefax();
        const faxItems: ServiceItem[] = [];
        for (const sn of faxNames) {
          try {
            const details = await voipIndexService.getFreefaxDetails(sn);
            faxItems.push({
              id: sn,
              type: 'fax',
              title: details.fromName || sn,
              subtitle: details.number || sn,
              badge: t('status.active'),
              badgeType: 'success',
            });
          } catch {
            faxItems.push({
              id: sn,
              type: 'fax',
              title: sn,
              subtitle: sn,
              badge: t('status.active'),
              badgeType: 'success',
            });
          }
        }
        setFaxServices(faxItems);

        // Carrier-SIP
        const carriers = await voipIndexService.listCarrierSip();
        const carrierItems: ServiceItem[] = carriers.map(c => ({
          id: `${c.billingAccount}/${c.serviceName}`,
          type: 'carrier-sip',
          billingAccount: c.billingAccount,
          title: c.serviceName,
          subtitle: c.billingAccount,
          badge: 'Trunk',
          badgeType: 'success',
        }));
        setCarrierSipServices(carrierItems);

        // Auto-select first service
        if (groupItems.length > 0) {
          setSelectedService(groupItems[0].id);
        } else if (smsItems.length > 0) {
          setActiveNav3('sms');
          setSelectedService(smsItems[0].id);
        } else if (faxItems.length > 0) {
          setActiveNav3('fax');
          setSelectedService(faxItems[0].id);
        } else if (carrierItems.length > 0) {
          setActiveNav3('carrier-sip');
          setSelectedService(carrierItems[0].id);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [t]);

  // Current items based on NAV3
  const currentItems = useMemo(() => {
    switch (activeNav3) {
      case 'sip': return voipGroups;
      case 'sms': return smsAccounts;
      case 'fax': return faxServices;
      case 'carrier-sip': return carrierSipServices;
      default: return voipGroups;
    }
  }, [activeNav3, voipGroups, smsAccounts, faxServices, carrierSipServices]);

  // Search
  const [search, setSearch] = useState('');
  const filteredItems = useMemo(() => {
    if (!search.trim()) return currentItems;
    const q = search.toLowerCase();
    return currentItems.filter(
      item => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q)
    );
  }, [currentItems, search]);

  // Handle NAV3 change
  const handleNav3Change = (nav3: Nav3Type) => {
    setActiveNav3(nav3);
    setSearch('');
    // Auto-select first service of new NAV3
    const items = nav3 === 'sip' ? voipGroups
      : nav3 === 'sms' ? smsAccounts
      : nav3 === 'fax' ? faxServices
      : carrierSipServices;
    if (items.length > 0) {
      setSelectedService(items[0].id);
    } else {
      setSelectedService(null);
    }
  };

  // Selected service data
  const selectedServiceData = useMemo(() => {
    return currentItems.find(item => item.id === selectedService) || null;
  }, [currentItems, selectedService]);

  // Note: No onboarding page - always show management layout

  return (
    <div className="voip-layout">
      {/* ============ LEFT PANEL ============ */}
      <div className="voip-left-panel">
        {/* NAV3 Tabs - 4 boutons compacts sur une ligne */}
        <div className="voip-nav3-tabs">
          <button
            className={`voip-nav3-tab ${activeNav3 === 'sip' ? 'active' : ''}`}
            onClick={() => handleNav3Change('sip')}
          >
            SIP<span className="voip-nav3-count">{counts.sip}</span>
          </button>
          <button
            className={`voip-nav3-tab ${activeNav3 === 'sms' ? 'active' : ''}`}
            onClick={() => handleNav3Change('sms')}
          >
            SMS<span className="voip-nav3-count">{counts.sms}</span>
          </button>
          <button
            className={`voip-nav3-tab ${activeNav3 === 'fax' ? 'active' : ''}`}
            onClick={() => handleNav3Change('fax')}
          >
            FAX<span className="voip-nav3-count">{counts.fax}</span>
          </button>
          <button
            className={`voip-nav3-tab ${activeNav3 === 'carrier-sip' ? 'active' : ''}`}
            onClick={() => handleNav3Change('carrier-sip')}
          >
            Trunk<span className="voip-nav3-count">{counts.carrierSip}</span>
          </button>
        </div>

        {/* Search */}
        <div className="voip-left-panel-search">
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Count */}
        <div className="voip-left-panel-count">
          {t('search.count', { count: filteredItems.length })}
        </div>

        {/* List */}
        <div className="voip-left-panel-list">
          {loading ? (
            <>
              <div className="voip-skeleton voip-skeleton-item" />
              <div className="voip-skeleton voip-skeleton-item" />
              <div className="voip-skeleton voip-skeleton-item" />
            </>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`voip-left-panel-item ${selectedService === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedService(item.id)}
              >
                <div className={`voip-left-panel-item-avatar ${item.type}`}>
                  {item.type === 'sip' && '📞'}
                  {item.type === 'sms' && '💬'}
                  {item.type === 'fax' && '📠'}
                  {item.type === 'carrier-sip' && '🔗'}
                </div>
                <div className="voip-left-panel-item-info">
                  <div className="voip-left-panel-item-title">{item.title}</div>
                  <div className="voip-left-panel-item-subtitle">{item.subtitle}</div>
                  {item.type === 'sip' && item.counts && (
                    <div className="voip-left-panel-item-counts">
                      ☎️ {item.counts.lines} · 🔢 {item.counts.numbers} · 📠 {item.counts.fax}
                    </div>
                  )}
                </div>
                {item.badge && (
                  <div className={`voip-left-panel-item-badge ${item.badgeType || 'success'}`}>
                    {item.badge}
                  </div>
                )}
              </div>
            ))
          )}
          {!loading && filteredItems.length === 0 && (
            <div className="voip-empty-state">
              <div className="voip-empty-state-icon">🔍</div>
              <div className="voip-empty-state-title">{t('search.noResults')}</div>
            </div>
          )}
        </div>
      </div>

      {/* ============ RIGHT PANEL ============ */}
      <div className="voip-right-panel">
        {error && (
          <div className="voip-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {loading ? (
          <div className="voip-loading">
            <div className="voip-loading-spinner" />
          </div>
        ) : (
          <>
            {/* SIP Panel - toujours afficher les NAV4 */}
            {activeNav3 === 'sip' && (
              <SipPanel
                billingAccount={selectedServiceData?.id || ''}
                title={selectedServiceData?.title || t('sip.title') || 'SIP'}
                subtitle={selectedServiceData?.subtitle || t('sip.noService') || 'Aucun service sélectionné'}
              />
            )}

            {/* SMS Panel */}
            {activeNav3 === 'sms' && (
              <SmsPanel
                accountName={selectedServiceData?.id || ''}
                title={selectedServiceData?.title || t('sms.title') || 'SMS'}
                subtitle={selectedServiceData?.subtitle || t('sms.noService') || 'Aucun service sélectionné'}
              />
            )}

            {/* FAX Panel */}
            {activeNav3 === 'fax' && (
              <FaxPanel
                serviceName={selectedServiceData?.id || ''}
                title={selectedServiceData?.title || t('fax.title') || 'FAX'}
                subtitle={selectedServiceData?.subtitle || t('fax.noService') || 'Aucun service sélectionné'}
              />
            )}

            {/* Carrier-SIP Panel */}
            {activeNav3 === 'carrier-sip' && (
              <CarrierSipPanel
                billingAccount={selectedServiceData?.billingAccount || ''}
                serviceName={selectedServiceData?.title || ''}
                title={selectedServiceData?.title || t('carrier.title') || 'Carrier SIP'}
                subtitle={selectedServiceData?.subtitle || t('carrier.noService') || 'Aucun service sélectionné'}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
