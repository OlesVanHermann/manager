// ============================================================
// HOSTING TAB: MULTISITE - Domaines attachés
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { AddDomainModal } from "../components/AddDomainModal";
import { EditDomainModal } from "../components/EditDomainModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

/** Onglet Multisite avec gestion complète des domaines attachés. */
export function MultisiteTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; domain: AttachedDomain | null }>({ open: false, domain: null });
  const [diagLoading, setDiagLoading] = useState<string | null>(null);
  const [restartLoading, setRestartLoading] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listAttachedDomains(serviceName);
      const data = await Promise.all(names.map(d => hostingService.getAttachedDomain(serviceName, d)));
      setDomains(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => { loadDomains(); }, [loadDomains]);

  // ---------- HANDLERS ----------
  const handleDelete = async (domain: string) => {
    if (!confirm(t("multisite.confirmDelete", { domain }))) return;
    try {
      await hostingService.deleteAttachedDomain(serviceName, domain);
      loadDomains();
    } catch (err) { alert(String(err)); }
  };

  const handleDiagnostic = async (domain: string) => {
    setDiagLoading(domain);
    try {
      const result = await hostingService.getDomainDigStatus(serviceName, domain);
      alert(`Diagnostic DNS pour ${domain}:\n\n` + 
        `IPv4: ${result.ipv4 ? 'OK' : 'Non configuré'}\n` +
        `IPv6: ${result.ipv6 ? 'OK' : 'Non configuré'}\n` +
        `CNAME: ${result.cname ? 'OK' : 'Non configuré'}`);
    } catch (err) {
      alert(`Erreur diagnostic: ${err}`);
    } finally {
      setDiagLoading(null);
    }
  };

  const handleRestart = async (domain: string) => {
    if (!confirm(`Redémarrer le vhost pour ${domain} ?`)) return;
    setRestartLoading(domain);
    try {
      await hostingService.restartAttachedDomain(serviceName, domain);
      alert("Redémarrage demandé. Veuillez patienter quelques minutes.");
      loadDomains();
    } catch (err) {
      alert(`Erreur: ${err}`);
    } finally {
      setRestartLoading(null);
    }
  };

  // ---------- FILTERING ----------
  const filteredDomains = useMemo(() => {
    if (!searchTerm) return domains;
    const term = searchTerm.toLowerCase();
    return domains.filter(d => d.domain.toLowerCase().includes(term));
  }, [domains, searchTerm]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(filteredDomains.length / PAGE_SIZE);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDomains.slice(start, start + PAGE_SIZE);
  }, [filteredDomains, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  // ---------- RENDER ----------
  return (
    <div className="multisite-tab">
      <div className="tab-header">
        <div>
          <h3>{t("multisite.title")}</h3>
          <p className="tab-description">{t("multisite.description")}</p>
        </div>
        <div className="tab-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            + {t("multisite.addDomain")}
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

      {/* Domains table */}
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
              <th>{t("multisite.git")}</th>
                <th>{t("multisite.cdn")}</th>
                <th>{t("multisite.firewall")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.map(d => (
                <tr key={d.domain}>
                  <td className="font-mono">{d.domain}</td>
                  <td className="font-mono">{d.path || "/"}</td>
                  <td>
                    <span className={`badge ${d.ssl ? 'success' : 'inactive'}`}>
                      {d.ssl ? 'Actif' : 'Non'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${d.git ? 'success' : 'inactive'}`}>
                      {d.git ? 'Actif' : 'Non'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${d.cdn === 'active' ? 'success' : 'inactive'}`}>
                      {d.cdn === 'active' ? 'Actif' : 'Non'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${d.firewall === 'active' ? 'success' : 'inactive'}`}>
                      {d.firewall === 'active' ? 'Actif' : 'Non'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-icon" 
                        onClick={() => setEditModal({ open: true, domain: d })}
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDiagnostic(d.domain)}
                        disabled={diagLoading === d.domain}
                        title={t("multisite.diagnostic")}
                      >
                        {diagLoading === d.domain ? '...' : '🔍'}
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleRestart(d.domain)}
                        disabled={restartLoading === d.domain}
                        title="Redémarrer"
                      >
                        {restartLoading === d.domain ? '...' : '🔄'}
                      </button>
                      <button 
                        className="btn-icon btn-danger-icon" 
                        onClick={() => handleDelete(d.domain)}
                        title={t("multisite.delete")}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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

      <EditDomainModal
        serviceName={serviceName}
        domain={editModal.domain}
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, domain: null })}
        onSuccess={loadDomains}
      />
    </div>
  );
}

export default MultisiteTab;
