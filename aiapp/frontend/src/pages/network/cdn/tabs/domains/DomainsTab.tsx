// ============================================================
// CDN Domains Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdnDomain } from "../../cdn.types";
import { domainsService } from "./DomainsTab.service";
import "./DomainsTab.css";

interface DomainsTabProps {
  serviceId: string;
}

export default function DomainsTab({ serviceId }: DomainsTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  const [domains, setDomains] = useState<CdnDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDomains();
  }, [serviceId]);

  const loadDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await domainsService.getDomains(serviceId);
      setDomains(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (domain: string) => {
    try {
      await domainsService.deleteDomain(serviceId, domain);
      loadDomains();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const handlePurge = async (domain: string) => {
    try {
      await domainsService.purgeDomain(serviceId, domain);
    } catch (err) {
      console.error("Erreur purge:", err);
    }
  };

  if (loading) {
    return <div className="domains-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="domains-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadDomains}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="domains-tab">
      <div className="domains-toolbar">
        <h2>{t("domains.title")}</h2>
        <button className="btn btn-primary">{t("domains.add")}</button>
      </div>

      {domains.length === 0 ? (
        <div className="domains-empty">
          <h2>{t("domains.empty.title")}</h2>
          <p>{t("domains.empty.description")}</p>
        </div>
      ) : (
        <table className="domains-table">
          <thead>
            <tr>
              <th>{t("domains.columns.domain")}</th>
              <th>{t("domains.columns.cname")}</th>
              <th>{t("domains.columns.status")}</th>
              <th>{t("domains.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.domain}>
                <td>
                  <span className="domains-domain-name">{domain.domain}</span>
                </td>
                <td>
                  <span className="domains-cname">{domain.cname}</span>
                </td>
                <td>
                  <span
                    className={`domains-status-badge ${domainsService.getStatusBadgeClass(domain.status)}`}
                  >
                    {domain.status}
                  </span>
                </td>
                <td>
                  <div className="domains-actions">
                    <button className="btn btn-sm btn-outline">
                      {t("domains.actions.configure")}
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handlePurge(domain.domain)}
                    >
                      {t("domains.actions.purge")}
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-danger"
                      onClick={() => handleDelete(domain.domain)}
                    >
                      {tCommon("actions.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
