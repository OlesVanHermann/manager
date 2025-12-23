// ============================================================
// HOSTING TAB: MULTISITE - Domaines attachés
// Version conforme OLD Manager avec wizards
// ============================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { AddDomainModal } from "../components";
import { 
  DeleteDomainWizard, 
  FlushCdnWizard, 
  DiagnosticModal,
  EditDomainWizard 
} from "../components/modals";

interface Props { 
  serviceName: string;
  hasCdn?: boolean;
  hasMultipleSsl?: boolean;
}

const PAGE_SIZE = 10;

// Types pour diagnostic
interface DiagnosticData {
  domain: string;
  recordType: "A" | "AAAA";
  currentIp: string | null;
  recommendedIp: string;
  isCorrect: boolean;
  isOvhZone: boolean;
  canChangeDns: boolean;
  contactAdmin?: string;
}

export function MultisiteTab({ serviceName, hasCdn = false, hasMultipleSsl = false }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDomain, setEditDomain] = useState<AttachedDomain | null>(null);
  const [deleteDomain, setDeleteDomain] = useState<AttachedDomain | null>(null);
  const [flushCdnDomain, setFlushCdnDomain] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData | null>(null);

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Global actions menu
  const [showGlobalMenu, setShowGlobalMenu] = useState(false);
  const globalMenuRef = useRef<HTMLDivElement>(null);

  // --- LOAD ---
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(n => hostingService.getAttachedDomain(serviceName, n)));
      setDomains(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
      if (globalMenuRef.current && !globalMenuRef.current.contains(e.target as Node)) {
        setShowGlobalMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS ---
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDomains();
    setRefreshing(false);
  };

  const handleRegenerateSslGlobal = async () => {
    if (!confirm(t("multisite.ssl.confirmRegenerate", "Voulez-vous régénérer le certificat SSL ?"))) return;
    try {
      await hostingService.regenerateSsl(serviceName);
      alert(t("multisite.ssl.regenerateSuccess", "Régénération SSL lancée"));
    } catch (err) {
      alert(String(err));
    }
    setShowGlobalMenu(false);
  };

  const handleViewLogs = (domain: AttachedDomain) => {
    // Ouvrir les logs dans un nouvel onglet (si ownLog activé)
    if (domain.ownLog) {
      window.open(`https://logs.ovh.net/${serviceName}/${domain.domain}/`, "_blank");
    }
    setOpenMenuId(null);
  };

  const handleOpenDiagnostic = (domain: AttachedDomain, recordType: "A" | "AAAA") => {
    // Simuler les données de diagnostic (à remplacer par API réelle)
    setDiagnosticData({
      domain: domain.domain,
      recordType,
      currentIp: null, // À récupérer via API digStatus
      recommendedIp: recordType === "A" ? "213.186.33.5" : "2001:41d0:1:1b00:213:186:33:5",
      isCorrect: false,
      isOvhZone: true,
      canChangeDns: true,
    });
  };

  // --- FILTERING & PAGINATION ---
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

  // --- RENDER HELPERS ---
  const renderBadge = (value: any, type: "ssl" | "cdn" | "firewall" | "ownLog" | "git") => {
    const isActive = value === true || value === "ACTIVE" || value === "active" || value === 1 || value === 2;
    const isPending = value === 1; // SSL en cours
    
    if (type === "ssl" && isPending) {
      return <span className="badge warning" title="En cours de génération">En cours</span>;
    }
    
    return (
      <span className={`badge ${isActive ? "success" : "inactive"}`}>
        {isActive ? "Activé" : "Inactif"}
      </span>
    );
  };

  const renderDiagnosticBadges = (domain: AttachedDomain) => {
    // Badges A et AAAA cliquables pour ouvrir le diagnostic
    return (
      <div className="diagnostic-badges">
        <button 
          className="badge-btn info" 
          onClick={() => handleOpenDiagnostic(domain, "A")}
          title="Vérifier l'enregistrement A"
        >
          A
        </button>
        <button 
          className="badge-btn info" 
          onClick={() => handleOpenDiagnostic(domain, "AAAA")}
          title="Vérifier l'enregistrement AAAA"
        >
          AAAA
        </button>
      </div>
    );
  };

  // --- RENDER ---
  if (loading) {
    return (
      <div className="multisite-tab">
        <div className="skeleton-block" style={{ height: "400px" }} />
      </div>
    );
  }

  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="multisite-tab">
      {/* Header avec menu global */}
      <div className="tab-header">
        <div className="tab-actions-left">
          {/* Menu Actions global (comme OLD Manager) */}
          {!hasMultipleSsl ? (
            <div className="dropdown-container" ref={globalMenuRef}>
              <button 
                className="btn btn-primary dropdown-toggle"
                onClick={() => setShowGlobalMenu(!showGlobalMenu)}
              >
                {t("multisite.actions", "Actions")} ▾
              </button>
              {showGlobalMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => { setShowAddModal(true); setShowGlobalMenu(false); }}>
                    {t("multisite.addDomain", "Ajouter un domaine")}
                  </button>
                  <button onClick={() => { /* Commander SSL */ setShowGlobalMenu(false); }}>
                    {t("multisite.ssl.order", "Commander un certificat SSL")}
                  </button>
                  <button onClick={handleRegenerateSslGlobal}>
                    {t("multisite.ssl.regenerate", "Régénérer le certificat SSL")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              + {t("multisite.addDomain", "Ajouter un domaine")}
            </button>
          )}
        </div>
        <div className="tab-actions">
          <button 
            className="btn btn-icon-only" 
            onClick={handleRefresh} 
            disabled={refreshing}
            title="Actualiser"
          >
            {refreshing ? "⏳" : "↻"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder={t("common.search", "Rechercher...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="records-count">{domains.length} {t("multisite.domains", "domaines")}</span>
      </div>

      {/* Table */}
      {paginatedDomains.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult", "Aucun résultat") : t("multisite.empty", "Aucun domaine attaché")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              {t("multisite.addFirstDomain", "Ajouter un premier domaine")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("multisite.domain", "Domaine")}</th>
                <th className="text-center">{t("multisite.diagnostic", "Diagnostic")}</th>
                <th>{t("multisite.path", "Dossier")}</th>
                <th className="text-center">{t("multisite.logseparate", "Logs")}</th>
                <th className="text-center">{t("multisite.firewall", "Firewall")}</th>
                {hasCdn && <th className="text-center">{t("multisite.cdn", "CDN")}</th>}
                {!hasMultipleSsl && <th className="text-center">{t("multisite.ssl", "SSL")}</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.map(domain => (
                <tr key={domain.domain}>
                  <td>
                    <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" className="domain-link">
                      {domain.domain}
                    </a>
                    {domain.status === "updating" && <span className="spinner-inline" title="Mise à jour en cours" />}
                  </td>
                  <td className="text-center">
                    {renderDiagnosticBadges(domain)}
                  </td>
                  <td><code>{domain.path || "./www"}</code></td>
                  <td className="text-center">{renderBadge(domain.ownLog, "ownLog")}</td>
                  <td className="text-center">{renderBadge(domain.firewall, "firewall")}</td>
                  {hasCdn && <td className="text-center">{renderBadge(domain.cdn, "cdn")}</td>}
                  {!hasMultipleSsl && <td className="text-center">{renderBadge(domain.ssl, "ssl")}</td>}
                  <td className="action-cell">
                    <div className="action-menu-container" ref={openMenuId === domain.domain ? menuRef : null}>
                      <button 
                        className={`btn-action-menu ${openMenuId === domain.domain ? "active" : ""}`}
                        onClick={() => setOpenMenuId(openMenuId === domain.domain ? null : domain.domain)}
                      >
                        ⋮
                      </button>
                      {openMenuId === domain.domain && (
                        <div className="action-dropdown">
                          <button onClick={() => { setEditDomain(domain); setOpenMenuId(null); }}>
                            {t("common.edit", "Modifier")}
                          </button>
                          {domain.ownLog && (
                            <button onClick={() => handleViewLogs(domain)}>
                              {t("multisite.viewLogs", "Voir les logs")}
                            </button>
                          )}
                          {(domain.cdn === "ACTIVE" || domain.cdn === true) && (
                            <button onClick={() => { setFlushCdnDomain(domain.domain); setOpenMenuId(null); }}>
                              {t("multisite.flushCdn", "Vider le cache CDN")}
                            </button>
                          )}
                          <div className="dropdown-divider" />
                          <button className="danger" onClick={() => { setDeleteDomain(domain); setOpenMenuId(null); }}>
                            {t("common.delete", "Supprimer")}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ←
              </button>
              <span className="pagination-info">
                {t("common.page", "Page")} {currentPage} / {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {/* === MODALS === */}
      
      {/* Add Domain Modal */}
      <AddDomainModal
        serviceName={serviceName}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadDomains}
      />

      {/* Edit Domain Wizard */}
      {editDomain && (
        <EditDomainWizard
          serviceName={serviceName}
          domain={editDomain}
          hasCdn={hasCdn}
          isOpen={!!editDomain}
          onClose={() => setEditDomain(null)}
          onSuccess={loadDomains}
        />
      )}

      {/* Delete Domain Wizard */}
      {deleteDomain && (
        <DeleteDomainWizard
          serviceName={serviceName}
          domain={deleteDomain}
          isOpen={!!deleteDomain}
          onClose={() => setDeleteDomain(null)}
          onSuccess={loadDomains}
        />
      )}

      {/* Flush CDN Wizard */}
      {flushCdnDomain && (
        <FlushCdnWizard
          serviceName={serviceName}
          domain={flushCdnDomain}
          isOpen={!!flushCdnDomain}
          onClose={() => setFlushCdnDomain(null)}
          onSuccess={loadDomains}
        />
      )}

      {/* Diagnostic Modal */}
      <DiagnosticModal
        serviceName={serviceName}
        diagnostic={diagnosticData}
        isOpen={!!diagnosticData}
        onClose={() => setDiagnosticData(null)}
      />
    </div>
  );
}

export default MultisiteTab;
