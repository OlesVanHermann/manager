// ============================================================
// MULTISITE TAB - 9 colonnes avec TOGGLES - TARGET STRICT
// Conforme target_.web-cloud.hebergement.hosting.multi-sites.svg
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { multisiteService } from "./MultisiteTab.service";
import type { AttachedDomain } from "../../hosting.types";
import { AddDomainModal, DeleteDomainWizard, FlushCdnWizard, DiagnosticModal, EditDomainWizard } from "./modals";
import "./MultisiteTab.css";

// ============================================================
// TYPES
// ============================================================

interface Props { 
  serviceName: string;
  hasCdn?: boolean;
  hasMultipleSsl?: boolean;
}

interface DomainRow extends AttachedDomain {
  isActive: boolean;
  sslType: string | null;
  cdnEnabled: boolean;
  firewallEnabled: boolean;
  logsEnabled: boolean;
  gitEnabled: boolean;
  ipv6Enabled: boolean;
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange?: () => void; disabled?: boolean }) {
  return (
    <button 
      className={`multisite-toggle ${enabled ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`}
      onClick={onChange}
      disabled={disabled}
    >
      <span className="multisite-toggle-knob" />
    </button>
  );
}

function IconAction({ icon, title, onClick }: { icon: string; title: string; onClick?: () => void }) {
  return <button className="multisite-icon-action" onClick={onClick} title={title}>{icon}</button>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function MultisiteTab({ serviceName, hasCdn = false, hasMultipleSsl = false }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");
  
  // ---------- STATE ----------
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDomain, setEditDomain] = useState<AttachedDomain | null>(null);
  const [deleteDomain, setDeleteDomain] = useState<AttachedDomain | null>(null);
  const [flushCdnDomain, setFlushCdnDomain] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  const PAGE_SIZE = 10;

  // ---------- LOAD DATA ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await multisiteService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(n => multisiteService.getAttachedDomain(serviceName, n)));
      
      // Transform to DomainRow with computed fields
      const rows: DomainRow[] = data.map(d => ({
        ...d,
        isActive: d.status === "created",
        sslType: d.ssl ? "Let's Encrypt" : null,
        cdnEnabled: d.cdn === "active" || d.cdn === "ACTIVE" || d.cdn === true,
        firewallEnabled: d.firewall === "active" || d.firewall === "ACTIVE" || d.firewall === true,
        logsEnabled: !!d.ownLog,
        gitEnabled: false, // À récupérer via API website
        ipv6Enabled: true, // Par défaut
      }));
      
      setDomains(rows);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // ---------- HANDLERS ----------
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDomains();
    setRefreshing(false);
  };

  const handleToggle = async (domain: DomainRow, field: keyof DomainRow) => {
    setUpdating(domain.domain);
    try {
      const updates: any = {};
      
      switch (field) {
        case 'cdnEnabled':
          updates.cdn = domain.cdnEnabled ? 'none' : 'active';
          break;
        case 'firewallEnabled':
          updates.firewall = domain.firewallEnabled ? 'none' : 'active';
          break;
        case 'logsEnabled':
          updates.ownLog = domain.logsEnabled ? null : domain.domain;
          break;
        case 'ipv6Enabled':
          // IPv6 toggle - pas d'API directe, update ipLocation
          break;
        default:
          break;
      }
      
      if (Object.keys(updates).length > 0) {
        await multisiteService.updateAttachedDomain(serviceName, domain.domain, updates);
        await loadDomains();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleSsl = async (domain: DomainRow) => {
    setUpdating(domain.domain);
    try {
      if (domain.sslType) {
        await fetch(`/api/ovh/hosting/web/${serviceName}/attachedDomain/${domain.domain}/ssl`, { method: 'DELETE' });
      } else {
        await fetch(`/api/ovh/hosting/web/${serviceName}/attachedDomain/${domain.domain}/ssl`, { method: 'POST' });
      }
      await loadDomains();
    } catch (err) {
      console.error("SSL toggle error:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleRegenerateSsl = async () => {
    try {
      await multisiteService.regenerateSsl(serviceName);
      alert("Régénération SSL lancée");
    } catch (err) {
      alert(String(err));
    }
  };

  const handleDelete = (domain: DomainRow) => {
    setDeleteDomain(domain);
  };

  // ---------- FILTERING & PAGINATION ----------
  const filteredDomains = useMemo(() => {
    if (!searchTerm) return domains;
    const term = searchTerm.toLowerCase();
    return domains.filter(d => d.domain.toLowerCase().includes(term));
  }, [domains, searchTerm]);

  const totalPages = Math.ceil(filteredDomains.length / PAGE_SIZE);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDomains.slice(start, start + PAGE_SIZE);
  }, [filteredDomains, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  // ---------- RENDER ----------
  if (loading) {
    return (
      <div className="multisite-tab">
        <div className="multisite-skeleton" />
      </div>
    );
  }

  if (error) return <div className="multisite-error">{error}</div>;

  return (
    <div className="multisite-tab">
      {/* === TOOLBAR === */}
      <div className="multisite-toolbar">
        <div className="multisite-toolbar-left">
          <button className="multisite-btn-refresh" onClick={handleRefresh} disabled={refreshing} title="Actualiser">
            {refreshing ? "⏳" : "↻"}
          </button>
          <input
            type="text"
            className="multisite-search"
            placeholder="Rechercher un domaine..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="multisite-btn-add" onClick={() => setShowAddModal(true)}>
            + Ajouter
          </button>
        </div>
        <div className="multisite-toolbar-right">
          <span className="multisite-count">{domains.length} domaine(s)</span>
        </div>
      </div>

      {/* === TABLE 9 COLONNES === */}
      {paginatedDomains.length === 0 ? (
        <div className="multisite-empty">
          <p>{searchTerm ? "Aucun résultat" : "Aucun domaine attaché"}</p>
          {!searchTerm && (
            <button className="multisite-btn-add" onClick={() => setShowAddModal(true)}>
              Ajouter un premier domaine
            </button>
          )}
        </div>
      ) : (
        <div className="multisite-table-wrap">
          <table className="multisite-table">
            <thead>
              <tr>
                <th className="multisite-col-domain">DOMAINE</th>
                <th className="multisite-col-folder">DOSSIER</th>
                <th className="multisite-col-toggle">STATUT</th>
                <th className="multisite-col-ssl">SSL</th>
                <th className="multisite-col-toggle">CDN</th>
                <th className="multisite-col-toggle">FIREWALL</th>
                <th className="multisite-col-toggle">LOGS</th>
                <th className="multisite-col-toggle">GIT</th>
                <th className="multisite-col-toggle">IPV6</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.map(domain => {
                const isUpdating = updating === domain.domain;
                const isInactive = !domain.isActive;
                
                return (
                  <tr key={domain.domain} className={isInactive ? 'inactive-row' : ''}>
                    {/* DOMAINE */}
                    <td className="multisite-col-domain">
                      <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" className="multisite-domain-link">
                        {domain.domain}
                      </a>
                      <IconAction icon="×" title="Supprimer" onClick={() => handleDelete(domain)} />
                    </td>
                    
                    {/* DOSSIER */}
                    <td className="multisite-col-folder">
                      <code>{domain.path || "./www"}</code>
                      <IconAction icon="✎" title="Modifier" onClick={() => setEditDomain(domain)} />
                    </td>
                    
                    {/* STATUT */}
                    <td className="multisite-col-toggle">
                      <Toggle enabled={domain.isActive} disabled={isUpdating} />
                    </td>
                    
                    {/* SSL - vide si inactif */}
                    <td className="multisite-col-ssl">
                      {!isInactive && (
                        <>
                          <span className="multisite-ssl-type">{domain.sslType || "—"}</span>
                          {domain.sslType && (
                            <>
                              <IconAction icon="↺" title="Régénérer" onClick={handleRegenerateSsl} />
                              <IconAction icon="⇄" title="Changer type" onClick={() => setShowAddModal(true)} />
                            </>
                          )}
                        </>
                      )}
                    </td>
                    
                    {/* CDN - vide si inactif */}
                    <td className="multisite-col-toggle">
                      {!isInactive && (
                        <Toggle 
                          enabled={domain.cdnEnabled} 
                          onChange={() => handleToggle(domain, 'cdnEnabled')}
                          disabled={isUpdating}
                        />
                      )}
                    </td>
                    
                    {/* FIREWALL - vide si inactif */}
                    <td className="multisite-col-toggle">
                      {!isInactive && (
                        <Toggle 
                          enabled={domain.firewallEnabled} 
                          onChange={() => handleToggle(domain, 'firewallEnabled')}
                          disabled={isUpdating}
                        />
                      )}
                    </td>
                    
                    {/* LOGS - vide si inactif */}
                    <td className="multisite-col-toggle">
                      {!isInactive && (
                        <Toggle 
                          enabled={domain.logsEnabled} 
                          onChange={() => handleToggle(domain, 'logsEnabled')}
                          disabled={isUpdating}
                        />
                      )}
                    </td>
                    
                    {/* GIT - vide si inactif */}
                    <td className="multisite-col-toggle">
                      {!isInactive && (
                        <Toggle 
                          enabled={domain.gitEnabled} 
                          disabled={isUpdating}
                        />
                      )}
                    </td>
                    
                    {/* IPV6 - vide si inactif */}
                    <td className="multisite-col-toggle">
                      {!isInactive && (
                        <Toggle 
                          enabled={domain.ipv6Enabled} 
                          onChange={() => handleToggle(domain, 'ipv6Enabled')}
                          disabled={isUpdating}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* === PAGINATION === */}
      {totalPages > 1 && (
        <div className="multisite-pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
        </div>
      )}

      {/* === INFO BOX === */}
      <div className="multisite-info-box">
        <strong>Multisite</strong>
        <p>Gérez les domaines attachés à votre hébergement. Chaque domaine peut avoir son propre dossier racine, certificat SSL et configuration CDN.</p>
      </div>

      {/* === MODALS === */}
      <AddDomainModal serviceName={serviceName} isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={loadDomains} />
      {editDomain && <EditDomainWizard serviceName={serviceName} domain={editDomain} hasCdn={hasCdn} isOpen={!!editDomain} onClose={() => setEditDomain(null)} onSuccess={loadDomains} />}
      {deleteDomain && <DeleteDomainWizard serviceName={serviceName} domain={deleteDomain} isOpen={!!deleteDomain} onClose={() => setDeleteDomain(null)} onSuccess={loadDomains} />}
      {flushCdnDomain && <FlushCdnWizard serviceName={serviceName} domain={flushCdnDomain} isOpen={!!flushCdnDomain} onClose={() => setFlushCdnDomain(null)} onSuccess={loadDomains} />}
      <DiagnosticModal serviceName={serviceName} diagnostic={diagnosticData} isOpen={!!diagnosticData} onClose={() => setDiagnosticData(null)} />
    </div>
  );
}

export default MultisiteTab;
