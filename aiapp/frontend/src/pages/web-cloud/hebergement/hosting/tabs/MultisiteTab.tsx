// ============================================================
// HOSTING TAB: MULTISITE - Domaines attachés
// ============================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { AddDomainModal, EditDomainModal } from "../components";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

export function MultisiteTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDomain, setEditDomain] = useState<AttachedDomain | null>(null);

  // Action menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
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

  const handleDelete = async (domain: string) => {
    if (!confirm(t("multisite.confirmDelete", { domain }))) return;
    try {
      await hostingService.deleteAttachedDomain(serviceName, domain);
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
    setOpenMenuId(null);
  };

  const handleFlushCdn = async (domain: string) => {
    try {
      await hostingService.flushDomainCdn(serviceName, domain);
      alert("Cache CDN vidé avec succès");
    } catch (err) {
      alert(String(err));
    }
    setOpenMenuId(null);
  };

  const handleRegenerateSsl = async (domain: string) => {
    try {
      await hostingService.regenerateSsl(serviceName);
      alert("Régénération SSL lancée");
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
    setOpenMenuId(null);
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
      {/* Header */}
      <div className="tab-header">
        <div className="tab-actions-left">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + {t("multisite.addDomain")}
          </button>
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
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="records-count">{domains.length} {t("multisite.domains")}</span>
      </div>

      {/* Table */}
      {paginatedDomains.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? t("common.noResult") : t("multisite.empty")}</p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
              {t("multisite.addFirstDomain")}
            </button>
          )}
        </div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("multisite.domain")}</th>
                <th>{t("multisite.path")}</th>
                <th>{t("multisite.ssl")}</th>
                <th>{t("multisite.cdn")}</th>
                <th>{t("multisite.firewall")}</th>
                <th>{t("multisite.logseparate")}</th>
                <th>{t("multisite.git")}</th>
                <th>{t("multisite.status")}</th>
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
                  </td>
                  <td><code>{domain.path || "./www"}</code></td>
                  <td>
                    <span className={`badge ${domain.ssl ? "success" : "inactive"}`}>
                      {domain.ssl ? "Activé" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${domain.cdn ? "success" : "inactive"}`}>
                      {domain.cdn ? "Activé" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${domain.firewall ? "success" : "inactive"}`}>
                      {domain.firewall ? "Activé" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${domain.ownLog ? "success" : "inactive"}`}>
                      {domain.ownLog ? "Activé" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${domain.git ? "success" : "inactive"}`}>
                      {domain.git ? "Activé" : "Inactif"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${domain.status === "ok" ? "success" : "warning"}`}>
                      {domain.status === "ok" ? "OK" : domain.status}
                    </span>
                  </td>
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
                            Modifier
                          </button>
                          {domain.cdn && (
                            <button onClick={() => handleFlushCdn(domain.domain)}>
                              Vider le cache CDN
                            </button>
                          )}
                          {domain.ssl && (
                            <button onClick={() => handleRegenerateSsl(domain.domain)}>
                              Régénérer SSL
                            </button>
                          )}
                          <button onClick={() => window.open(`https://logs.ovh.net/${serviceName}/${domain.domain}/`, "_blank")}>
                            Voir les logs
                          </button>
                          <div className="dropdown-divider" />
                          <button className="danger" onClick={() => handleDelete(domain.domain)}>
                            Supprimer
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
                {t("common.page")} {currentPage} / {totalPages}
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

      {/* Modals */}
      <AddDomainModal
        serviceName={serviceName}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadDomains}
      />

      {editDomain && (
        <EditDomainModal
          serviceName={serviceName}
          domain={editDomain}
          isOpen={!!editDomain}
          onClose={() => setEditDomain(null)}
          onSuccess={loadDomains}
        />
      )}
    </div>
  );
}

export default MultisiteTab;
