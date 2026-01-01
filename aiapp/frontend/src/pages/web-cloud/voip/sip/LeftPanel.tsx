// ============================================================
// LEFT PANEL - Liste des groupes VoIP / SMS / FAX
// Target: target_.web-cloud.voip.dashboard.svg (Left Panel)
// ============================================================

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TelephonyGroupSummary, VoipLeftPanelItem, ServiceFilterType } from '../voip.types';

interface LeftPanelProps {
  groups: TelephonyGroupSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
  // Nouveaux props pour SMS/FAX
  smsAccounts?: Array<{ name: string; creditsLeft: number }>;
  faxServices?: Array<{ serviceName: string; description?: string }>;
}

export function LeftPanel({ groups, selectedId, onSelect, loading, smsAccounts = [], faxServices = [] }: LeftPanelProps) {
  const { t } = useTranslation('web-cloud/voip/index');
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ServiceFilterType>('voip');

  // Transformer les groupes VoIP en items
  const voipItems: VoipLeftPanelItem[] = useMemo(() => {
    return groups.map((g) => ({
      id: g.billingAccount,
      type: 'voip' as const,
      title: g.description || g.billingAccount,
      subtitle: g.billingAccount,
      badge: g.status === 'enabled' ? t('status.active') : t('status.expired'),
      badgeType: g.status === 'enabled' ? 'success' as const : 'error' as const,
      counts: {
        lines: g.linesCount,
        numbers: g.numbersCount,
        fax: g.faxCount,
      },
    }));
  }, [groups, t]);

  // Transformer les comptes SMS en items
  const smsItems: VoipLeftPanelItem[] = useMemo(() => {
    return smsAccounts.map((s) => ({
      id: s.name,
      type: 'sms' as const,
      title: s.name,
      subtitle: `${s.creditsLeft} crédits`,
      badge: s.creditsLeft > 0 ? t('status.active') : 'Vide',
      badgeType: s.creditsLeft > 0 ? 'success' as const : 'warning' as const,
    }));
  }, [smsAccounts, t]);

  // Transformer les services Fax en items
  const faxItems: VoipLeftPanelItem[] = useMemo(() => {
    return faxServices.map((f) => ({
      id: f.serviceName,
      type: 'fax' as const,
      title: f.description || f.serviceName,
      subtitle: f.serviceName,
      badge: t('status.active'),
      badgeType: 'success' as const,
    }));
  }, [faxServices, t]);

  // Sélectionner les items selon le filtre actif
  const currentItems = useMemo(() => {
    switch (activeFilter) {
      case 'sms': return smsItems;
      case 'fax': return faxItems;
      default: return voipItems;
    }
  }, [activeFilter, voipItems, smsItems, faxItems]);

  // Filtrer selon la recherche
  const filteredItems = useMemo(() => {
    if (!search.trim()) return currentItems;
    const query = search.toLowerCase();
    return currentItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [currentItems, search]);

  // Compteurs pour les badges des filtres
  const counts = {
    voip: groups.length,
    sms: smsAccounts.length,
    fax: faxServices.length,
  };

  if (loading) {
    return (
      <div className="voip-left-panel">
        <div className="voip-left-panel-search">
          <input type="text" placeholder={t('search.placeholder')} disabled />
        </div>
        <div className="voip-left-panel-count">{t('search.loading')}</div>
        <div className="voip-left-panel-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="voip-skeleton voip-skeleton-item" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="voip-left-panel">
      {/* Filtres VoIP / SMS / FAX */}
      <div className="voip-left-panel-filters">
        <button
          className={`voip-filter-btn ${activeFilter === 'voip' ? 'active' : ''}`}
          onClick={() => {
            setActiveFilter('voip');
          }}
        >
          📞 VoIP
          <span className="voip-filter-count">{counts.voip}</span>
        </button>
        <button
          className={`voip-filter-btn ${activeFilter === 'sms' ? 'active' : ''}`}
          onClick={() => {
            setActiveFilter('sms');
          }}
        >
          💬 SMS
          <span className="voip-filter-count">{counts.sms}</span>
        </button>
        <button
          className={`voip-filter-btn ${activeFilter === 'fax' ? 'active' : ''}`}
          onClick={() => {
            setActiveFilter('fax');
          }}
        >
          📠 FAX
          <span className="voip-filter-count">{counts.fax}</span>
        </button>
      </div>

      {/* Recherche */}
      <div className="voip-left-panel-search">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* Compteur */}
      <div className="voip-left-panel-count">
        {t('search.count', { count: filteredItems.length })}
      </div>

      {/* Liste */}
      <div className="voip-left-panel-list">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`voip-left-panel-item ${selectedId === item.id ? 'selected' : ''}`}
            onClick={() => {
              onSelect(item.id);
            }}
          >
            {/* Avatar selon type */}
            <div className={`voip-left-panel-item-avatar ${item.type}`}>
              {item.type === 'voip' && '📞'}
              {item.type === 'sms' && '💬'}
              {item.type === 'fax' && '📠'}
            </div>

            {/* Info */}
            <div className="voip-left-panel-item-info">
              <div className="voip-left-panel-item-title">{item.title}</div>
              <div className="voip-left-panel-item-subtitle">{item.subtitle}</div>
              {item.type === 'voip' && item.counts && (
                <div className="voip-left-panel-item-counts">
                  {item.counts.lines !== undefined && `☎️ ${item.counts.lines}`}
                  {item.counts.numbers !== undefined && ` · 🔢 ${item.counts.numbers}`}
                  {item.counts.fax !== undefined && ` · 📠 ${item.counts.fax}`}
                </div>
              )}
            </div>

            {/* Badge */}
            {item.badge && (
              <div className={`voip-left-panel-item-badge ${item.badgeType || 'success'}`}>
                {item.badge}
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && !loading && (
          <div className="voip-empty-state">
            <div className="voip-empty-state-icon">🔍</div>
            <div className="voip-empty-state-title">{t('search.noResults')}</div>
          </div>
        )}
      </div>
    </div>
  );
}
