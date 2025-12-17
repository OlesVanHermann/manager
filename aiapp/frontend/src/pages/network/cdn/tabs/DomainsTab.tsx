import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as cdnService from "../../../../services/network.cdn";

interface CdnDomain { domain: string; status: string; cname: string; }
interface DomainsTabProps { serviceId: string; }

export default function DomainsTab({ serviceId }: DomainsTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  const [domains, setDomains] = useState<CdnDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadDomains(); }, [serviceId]);

  const loadDomains = async () => {
    try { setLoading(true); setError(null); const data = await cdnService.getDomains(serviceId); setDomains(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { on: "badge-success", off: "badge-error", config: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadDomains}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="domains-tab">
      <div className="tab-toolbar"><h2>{t("domains.title")}</h2><button className="btn btn-primary">{t("domains.add")}</button></div>
      {domains.length === 0 ? (
        <div className="empty-state"><h2>{t("domains.empty.title")}</h2><p>{t("domains.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("domains.columns.domain")}</th><th>{t("domains.columns.cname")}</th><th>{t("domains.columns.status")}</th><th>{t("domains.columns.actions")}</th></tr></thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.domain}>
                <td><strong>{domain.domain}</strong></td>
                <td className="mono" style={{ fontSize: "var(--font-size-sm)" }}>{domain.cname}</td>
                <td>{getStatusBadge(domain.status)}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{t("domains.actions.configure")}</button><button className="btn btn-sm btn-outline">{t("domains.actions.purge")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
