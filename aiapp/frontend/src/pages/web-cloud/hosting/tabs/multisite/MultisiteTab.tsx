// ============================================================
// MULTISITE TAB - 10 colonnes avec BADGES - TARGET STRICT
// Conforme target_.web-cloud.hosting.multisite.svg
// ============================================================

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
}

interface DomainRow extends AttachedDomain {
  sslActive: boolean;
  cdnActive: boolean;
  firewallActive: boolean;
  logsActive: boolean;
  runtime: string;
  gitActive: boolean;
  diagnosticStatus: "ok" | "warning" | "error";
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function Badge({ status, label }: { status: "active" | "disabled" | "yes" | "no"; label: string }) {
  const cls = status === "active" || status === "yes" ? "multisite-badge-active" : "multisite-badge-disabled";
  return <span className={`multisite-badge ${cls}`}>{label}</span>;
}

function DiagnosticDot({ status }: { status: "ok" | "warning" | "error" }) {
  const cls = status === "ok" ? "multisite-dot-ok" : status === "warning" ? "multisite-dot-warning" : "multisite-dot-error";
  return <span className={`multisite-dot ${cls}`}>●</span>;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function MultisiteTab({ serviceName, hasCdn = false }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.multisite");

  // ---------- STATE ----------
  const [domains, setDomains] = useState<DomainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openMenuDomain, setOpenMenuDomain] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editDomain, setEditDomain] = useState<AttachedDomain | null>(null);
  const [deleteDomain, setDeleteDomain] = useState<AttachedDomain | null>(null);
  const [flushCdnDomain, setFlushCdnDomain] = useState<string | null>(null);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  // ---------- LOAD DATA ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await multisiteService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(n => multisiteService.getAttachedDomain(serviceName, n)));

      const rows: DomainRow[] = data.map(d => ({
        ...d,
        sslActive: !!d.ssl,
        cdnActive: d.cdn === "active" || d.cdn === "ACTIVE" || d.cdn === true,
        firewallActive: d.firewall === "active" || d.firewall === "ACTIVE" || d.firewall === true,
        logsActive: !!d.ownLog,
        runtime: "php-8.2",
        gitActive: !!d.git,
        diagnosticStatus: "ok" as const,
      }));

      setDomains(rows);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuDomain(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------- HANDLERS ----------
  const handleRegenerateSsl = async () => {
    try {
      await multisiteService.regenerateSsl(serviceName);
      alert(t("ssl.regenerateSuccess"));
    } catch (err) {
      alert(String(err));
    }
  };

  const handleMenuAction = (action: string, domain: DomainRow) => {
    setOpenMenuDomain(null);
    switch (action) {
      case "edit": setEditDomain(domain); break;
      case "logs": window.open(`https://logs.ovh.net/${serviceName}/${domain.domain}/`, "_blank"); break;
      case "flushCdn": setFlushCdnDomain(domain.domain); break;
      case "git": window.open(`/web-cloud/hosting/${serviceName}/website/${domain.domain}/git`, "_blank"); break;
      case "delete": setDeleteDomain(domain); break;
    }
  };

  // ---------- FILTERING & PAGINATION ----------
  const filteredDomains = useMemo(() => {
    if (!searchTerm) return domains;
    const term = searchTerm.toLowerCase();
    return domains.filter(d => d.domain.toLowerCase().includes(term));
  }, [domains, searchTerm]);

  const totalItems = filteredDomains.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedDomains = filteredDomains.slice(startIndex, endIndex);

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
        <button className="multisite-btn-primary" onClick={() => setShowAddModal(true)}>
          + {t("toolbar.addDomain")}
        </button>
        <button className="multisite-btn-outline" onClick={handleRegenerateSsl}>
          ↻ {t("toolbar.regenerateSsl")}
        </button>
        <div className="multisite-toolbar-spacer" />
        <input
          type="text"
          className="multisite-search"
          placeholder={t("toolbar.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* === TABLE === */}
      {paginatedDomains.length === 0 ? (
        <div className="multisite-empty">
          <p>{searchTerm ? t("table.noResults") : t("table.noDomains")}</p>
        </div>
      ) : (
        <div className="multisite-table-container">
          <table className="multisite-table">
            <thead>
              <tr>
                <th>{t("table.domain")}</th>
                <th>{t("table.folder")}</th>
                <th>{t("table.ssl")}</th>
                <th>{t("table.cdn")}</th>
                <th>{t("table.firewall")}</th>
                <th>{t("table.logs")}</th>
                <th>{t("table.runtime")}</th>
                <th>{t("table.git")}</th>
                <th>{t("table.diagnostic")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.map(domain => (
                <tr key={domain.domain}>
                  <td className="multisite-domain-cell">
                    <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer" className="multisite-domain-link">
                      {domain.domain}
                    </a>
                  </td>
                  <td>{domain.path || "/www"}</td>
                  <td>
                    <Badge status={domain.sslActive ? "active" : "disabled"} label={domain.sslActive ? t("badge.active") : t("badge.inactive")} />
                  </td>
                  <td>
                    <Badge status={domain.cdnActive ? "active" : "disabled"} label={domain.cdnActive ? t("badge.active") : t("badge.disabled")} />
                  </td>
                  <td>
                    <Badge status={domain.firewallActive ? "active" : "disabled"} label={domain.firewallActive ? t("badge.active") : t("badge.inactive")} />
                  </td>
                  <td>
                    <Badge status={domain.logsActive ? "active" : "disabled"} label={domain.logsActive ? t("badge.active") : t("badge.disabled")} />
                  </td>
                  <td>{domain.runtime}</td>
                  <td>
                    <Badge status={domain.gitActive ? "yes" : "no"} label={domain.gitActive ? t("badge.yes") : t("badge.no")} />
                  </td>
                  <td>
                    <DiagnosticDot status={domain.diagnosticStatus} />
                  </td>
                  <td className="multisite-actions-cell">
                    <button
                      className="multisite-actions-btn"
                      onClick={() => setOpenMenuDomain(openMenuDomain === domain.domain ? null : domain.domain)}
                    >
                      ⋮
                    </button>
                    {openMenuDomain === domain.domain && (
                      <div className="multisite-actions-menu" ref={menuRef}>
                        <button onClick={() => handleMenuAction("edit", domain)}>{t("actions.edit")}</button>
                        <button onClick={() => handleMenuAction("logs", domain)}>{t("actions.logs")}</button>
                        {domain.cdnActive && (
                          <button onClick={() => handleMenuAction("flushCdn", domain)}>{t("actions.flushCdn")}</button>
                        )}
                        <button onClick={() => handleMenuAction("git", domain)}>{t("actions.git")}</button>
                        <button className="multisite-action-danger" onClick={() => handleMenuAction("delete", domain)}>{t("actions.detach")}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === PAGINATION === */}
      <div className="multisite-pagination">
        <span className="multisite-pagination-info">
          {t("pagination.showing")} {startIndex + 1}-{endIndex} {t("pagination.of")} {totalItems}
        </span>
        <div className="multisite-pagination-controls">
          <span className="multisite-pagination-label">{t("pagination.perPage")}</span>
          <select
            className="multisite-pagination-select"
            value={itemsPerPage}
            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="multisite-pagination-buttons">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>‹</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={currentPage === page ? "active" : ""}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
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
