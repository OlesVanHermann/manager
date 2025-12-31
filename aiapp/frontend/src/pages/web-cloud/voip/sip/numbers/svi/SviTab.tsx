// ============================================================
// NUMBER SVI TAB - Gestion des menus vocaux interactifs
// Target: target_.web-cloud.voip.number.svi-menus.svg
// DEFACTORISATION: Composants UI dupliqués, service isolé
// ============================================================

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { sviTabService } from './SviTab.service';
import './SviTab.css';

// ============================================================
// COMPOSANTS UI DUPLIQUÉS (ISOLATION)
// ============================================================

function Tile({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`voip-tile ${className}`}>
      <div className="voip-tile-header">{title}</div>
      <div className="voip-tile-content">{children}</div>
    </div>
  );
}

function Badge({ type = 'default', children }: { type?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'neutral'; children: React.ReactNode }) {
  return <span className={`voip-badge voip-badge-${type}`}>{children}</span>;
}

// ============================================================
// TYPES LOCAUX
// ============================================================

interface LocalSviMenu {
  id: number;
  name: string;
  soundName: string;
  entries: LocalSviEntry[];
  isRoot: boolean;
}

interface LocalSviEntry {
  dtmf: string;
  destinationType: 'queue' | 'menu' | 'line' | 'voicemail' | 'hangup' | 'repeat';
  destinationName: string;
}

interface SviStats {
  totalMenus: number;
  maxDepth: number;
  totalCalls: number;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

interface SviTabProps {
  billingAccount: string;
  serviceName: string;
}

export function SviTab({ billingAccount, serviceName }: SviTabProps) {
  const { t } = useTranslation('web-cloud/voip/numbers/svi');

  // ---------- STATE ----------
  const [menus, setMenus] = useState<LocalSviMenu[]>([]);
  const [stats, setStats] = useState<SviStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());

  // ---------- EFFECTS ----------
  useEffect(() => {
    loadSvi();
  }, [billingAccount, serviceName]);

  const loadSvi = async () => {
    try {
      setLoading(true);
      setError(null);
      const menusData = await sviTabService.getMenus(billingAccount, serviceName);
      // Convert API response to local format
      const localMenus: LocalSviMenu[] = menusData.map((m, idx) => ({
        id: m.menuId,
        name: m.name,
        soundName: m.greetSound || '-',
        entries: m.entries.map((e) => ({
          dtmf: e.dtmf,
          destinationType: e.action as LocalSviEntry['destinationType'],
          destinationName: e.actionParam || '-',
        })),
        isRoot: idx === 0,
      }));
      setMenus(localMenus);
      setStats({
        totalMenus: localMenus.length,
        maxDepth: Math.max(1, ...localMenus.map((m) => m.entries.filter((e) => e.destinationType === 'menu').length)),
        totalCalls: 0,
      });
      if (localMenus.length > 0) {
        setExpandedMenus(new Set([localMenus[0].id]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.loading'));
    } finally {
      setLoading(false);
    }
  };

  // ---------- HANDLERS ----------
  const toggleMenu = (menuId: number) => {
    const newExpanded = new Set(expandedMenus);
    if (newExpanded.has(menuId)) {
      newExpanded.delete(menuId);
    } else {
      newExpanded.add(menuId);
    }
    setExpandedMenus(newExpanded);
  };

  const handleDeleteMenu = async (menuId: number) => {
    if (!confirm(t('confirm.delete'))) return;
    try {
      await sviTabService.deleteMenu(billingAccount, serviceName, menuId);
      setMenus(menus.filter((m) => m.id !== menuId));
    } catch (err) {
      alert(err instanceof Error ? err.message : t('error.delete'));
    }
  };

  // ---------- HELPERS ----------
  const getDestinationIcon = (type: LocalSviEntry['destinationType']) => {
    switch (type) {
      case 'queue':
        return '📞';
      case 'menu':
        return '📋';
      case 'line':
        return '☎️';
      case 'voicemail':
        return '📩';
      case 'hangup':
        return '📵';
      case 'repeat':
        return '🔄';
      default:
        return '➡️';
    }
  };

  const getDtmfClass = (dtmf: string) => {
    if (['*', '#', '0'].includes(dtmf)) return 'dtmf-special';
    return 'dtmf-number';
  };

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="svi-tab">
        <div className="loading-state">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="svi-tab">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="svi-tab">
      {/* Info banner */}
      <div className="svi-info-banner">
        <span className="info-icon">🎙️</span>
        <div>
          <strong>{t('info.title')}</strong>
          <p>{t('info.description')}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="svi-toolbar">
        <button className="btn btn-icon" onClick={loadSvi} title={t('actions.refresh')}>
          ↻
        </button>
        <button className="btn btn-primary">{t('actions.create')}</button>
      </div>

      {/* Stats cards */}
      {stats && (
        <div className="svi-stats">
          <div className="stat-card">
            <span className="stat-value">{stats.totalMenus}</span>
            <span className="stat-label">{t('stats.menus')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.maxDepth}</span>
            <span className="stat-label">{t('stats.depth')}</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalCalls.toLocaleString()}</span>
            <span className="stat-label">{t('stats.calls')}</span>
          </div>
        </div>
      )}

      {/* Menus list */}
      <Tile title={t('menus.title')}>
        {menus.length === 0 ? (
          <div className="empty-state">
            <p>{t('menus.empty')}</p>
            <button className="btn btn-primary">{t('actions.createFirst')}</button>
          </div>
        ) : (
          <div className="svi-menus-list">
            {menus.map((menu) => (
              <div key={menu.id} className="svi-menu-card">
                <div className="menu-header" onClick={() => toggleMenu(menu.id)}>
                  <span className="expand-icon">
                    {expandedMenus.has(menu.id) ? '▼' : '▶'}
                  </span>
                  <span className="menu-name">{menu.name}</span>
                  {menu.isRoot && (
                    <Badge type="info">{t('menus.root')}</Badge>
                  )}
                  <span className="menu-sound">🔊 {menu.soundName}</span>
                  <div className="menu-actions">
                    <button className="btn-icon" title={t('actions.edit')}>
                      ✎
                    </button>
                    <button
                      className="btn-icon btn-icon-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMenu(menu.id);
                      }}
                      title={t('actions.delete')}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {expandedMenus.has(menu.id) && (
                  <div className="menu-entries">
                    {menu.entries.map((entry, index) => (
                      <div key={index} className="menu-entry">
                        <span className={`dtmf-key ${getDtmfClass(entry.dtmf)}`}>
                          {entry.dtmf}
                        </span>
                        <span className="entry-arrow">→</span>
                        <span className="entry-icon">
                          {getDestinationIcon(entry.destinationType)}
                        </span>
                        <span className="entry-destination">
                          {entry.destinationName}
                        </span>
                        <Badge type="neutral">{t(`types.${entry.destinationType}`)}</Badge>
                      </div>
                    ))}
                    {menu.entries.length === 0 && (
                      <div className="no-entries">{t('menus.noEntries')}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Tile>

      {/* Limits info */}
      <div className="svi-limits">
        <span>⚠️ {t('limits.info')}</span>
      </div>
    </div>
  );
}
