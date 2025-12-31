// ============================================================
// LEFT PANEL - Liste des groupes VoIP
// Target: target_.web-cloud.voip.dashboard.svg (Left Panel)
// ============================================================

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TelephonyGroupSummary, VoipLeftPanelItem } from '../voip.types';

interface LeftPanelProps {
  groups: TelephonyGroupSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
}

export function LeftPanel({ groups, selectedId, onSelect, loading }: LeftPanelProps) {
  const { t } = useTranslation('web-cloud/telecom/voip/index');
  const [search, setSearch] = useState('');

  // Transformer les groupes en items pour le panel
  const items: VoipLeftPanelItem[] = useMemo(() => {
    return groups.map((g) => ({
      id: g.billingAccount,
      type: 'groups' as const,
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

  // Filtrer selon la recherche
  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
    );
  }, [items, search]);

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
      {/* Recherche */}
      <div className="voip-left-panel-search">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            onClick={() => onSelect(item.id)}
          >
            {/* Avatar */}
            <div className={`voip-left-panel-item-avatar ${item.type}`}>VoIP</div>

            {/* Info */}
            <div className="voip-left-panel-item-info">
              <div className="voip-left-panel-item-title">{item.title}</div>
              <div className="voip-left-panel-item-subtitle">{item.subtitle}</div>
              {item.counts && (
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
