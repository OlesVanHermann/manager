// ============================================================
// HOSTING TAB: MULTISITE - Domaines attachés
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { AddDomainModal } from "../components/AddDomainModal";

interface Props { serviceName: string; }

const PAGE_SIZE = 10;

/** Onglet Multisite avec diagnostic DNS, pagination et recherche. */
export function MultisiteTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const handleDelete = async (domain: string) => {
    if (!confirm(t("multisite.confirmDelete", { domain }))) return;
    try {
      await hostingService.deleteAttachedDomain(serviceName, domain);
      loadDomains();
    } catch (err) { alert(String(err)); }
  };

  // Filtering
  const filteredDomains = useMemo(() => {
    if (!searchTerm) return domains;
    const term = searchTerm.toLowerCase();
    return domains.filter(d => 
      d.domain.toLowerCase().includes(term) || 
      d.path?.toLowerCase().includes(term)
    );
  }, [domains, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredDomains.length / PAGE_SIZE);
  const paginatedDomains = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDomains.slice(start, start + PAGE_SIZE);
  }, [filteredDomains, currentPage]);

  // Reset page on search
  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const getDnsBadge = (status?: string) => {
    if (status === 'ok') return <span className="badge-sm success">A/AAAA ✓</span>;
    return <span className="badge-sm inactive">A/AAAA ○</span>;
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="multisite-tab">
      <div className="tab-header">
        <div>
          <h3>{t("multisite.title")}</h3>
          <p className="tab-description">{t("multisite.description")}</p>
        </div>
        <div className="tab-actions">
          <span className="records-count">{domains.length} {t("multisite.domains")}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            + {t("multisite.addDomain")}
          </button>
        </div>
      </div>

      {/* Info banner SSL */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <span>La gestion SSL a été déplacée vers l'onglet "Certificats SSL".</span>
      </div>

      {/* Search + toolbar */}
      <div className="table-toolbar">
        <input
          type="text"
          className="search-input"
          placeholder={t("common.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

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
                <th>{t("multisite.diagnostic")}</th>
                <th>{t("multisite.ssl")}</th>
                <th>{t("multisite.firewall")}</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDomains.map(d => (
                <tr key={d.domain}>
                  <td className="font-mono">{d.domain}</td>
                  <td className="font-mono">{d.path || '/'}</td>
                  <td>
                    <div className="dns-badges">
                      {getDnsBadge(d.ipv4Status)}
                      {d.ownLog && <span className="badge-sm info">Logs</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${d.ssl ? 'success' : 'inactive'}`}>
                      {d.ssl ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${d.firewall === 'active' ? 'success' : 'inactive'}`}>
                      {d.firewall === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon btn-danger-icon" 
                      onClick={() => handleDelete(d.domain)}
                      title={t("multisite.delete")}
                    >
                      🗑
                    </button>
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

      <AddDomainModal
        serviceName={serviceName}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadDomains}
      />
    </div>
  );
}

export default MultisiteTab;
