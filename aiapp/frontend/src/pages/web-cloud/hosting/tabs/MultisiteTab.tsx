// ============================================================
// HOSTING TAB: MULTISITE - Domaines attaches
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { hostingService, AttachedDomain } from "../../../../services/web-cloud.hosting";

interface Props { serviceName: string; }

/** Onglet Multisite - Gestion des domaines attaches. */
export function MultisiteTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [domains, setDomains] = useState<AttachedDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await hostingService.listAttachedDomains(serviceName);
        const details = await Promise.all(names.map(d => hostingService.getAttachedDomain(serviceName, d)));
        setDomains(details);
      } catch (err) { setError(String(err)); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="multisite-tab">
      <div className="tab-header">
        <div>
          <h3>{t("multisite.title")}</h3>
          <p className="tab-description">{t("multisite.description")}</p>
        </div>
        <span className="records-count">{domains.length} {t("multisite.domains")}</span>
      </div>

      {domains.length === 0 ? (
        <div className="empty-state"><p>{t("multisite.empty")}</p></div>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MultisiteTab;
