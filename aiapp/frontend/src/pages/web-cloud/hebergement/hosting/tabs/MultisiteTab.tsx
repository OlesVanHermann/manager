// ============================================================
// HOSTING TAB: MULTISITE - Domaines attaches
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../../services/web-cloud.hosting";
import { AddDomainModal } from "../components/AddDomainModal";

interface Props { serviceName: string; }

/** Onglet Multisite - Gestion des domaines attaches. */
export function MultisiteTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadDomains = useCallback(async () => {
    try {
      setLoading(true);
      const names = await hostingService.listAttachedDomains(serviceName);
      const details = await Promise.all(names.map(d => hostingService.getAttachedDomain(serviceName, d)));
      setDomains(details);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName]);

  useEffect(() => {
    loadDomains();
  }, [loadDomains]);

  const handleDeleteDomain = async (domain: string) => {
    if (!confirm(t("multisite.confirmDelete", { domain }))) return;
    try {
      await hostingService.deleteAttachedDomain(serviceName, domain);
      loadDomains();
    } catch (err) {
      alert(String(err));
    }
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

      {domains.length === 0 ? (
        <div className="empty-state">
          <p>{t("multisite.empty")}</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            {t("multisite.addFirstDomain")}
          </button>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>{t("multisite.domain")}</th>
              <th>{t("multisite.path")}</th>
              <th>{t("multisite.ssl")}</th>
              <th>{t("multisite.cdn")}</th>
              <th>{t("multisite.firewall")}</th>
              <th>{t("multisite.status")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.domain}>
                <td className="font-mono">{d.domain}</td>
                <td className="font-mono">{d.path}</td>
                <td><span className={`badge ${d.ssl ? 'success' : 'inactive'}`}>{d.ssl ? '✓' : '✗'}</span></td>
                <td><span className={`badge ${d.cdn === 'active' ? 'success' : 'inactive'}`}>{d.cdn}</span></td>
                <td><span className={`badge ${d.firewall === 'active' ? 'success' : 'inactive'}`}>{d.firewall}</span></td>
                <td><span className={`badge ${d.status === 'created' ? 'success' : 'warning'}`}>{d.status}</span></td>
                <td>
                  <button className="btn-icon btn-danger-icon" onClick={() => handleDeleteDomain(d.domain)} title={t("multisite.delete")}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
