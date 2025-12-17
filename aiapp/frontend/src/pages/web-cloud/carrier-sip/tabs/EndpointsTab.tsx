import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as carrierSipService from "../../../../services/web-cloud.carrier-sip";

interface Endpoint { id: string; ip: string; priority: number; weight: number; status: string; }
interface EndpointsTabProps { serviceId: string; }

export default function EndpointsTab({ serviceId }: EndpointsTabProps) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const { t: tCommon } = useTranslation("common");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadEndpoints(); }, [serviceId]);

  const loadEndpoints = async () => {
    try { setLoading(true); setError(null); const data = await carrierSipService.getEndpoints(serviceId); setEndpoints(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", inactive: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{status}</span>;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadEndpoints}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="endpoints-tab">
      <div className="tab-toolbar"><h2>{t("endpoints.title")}</h2><button className="btn btn-primary">{t("endpoints.add")}</button></div>
      {endpoints.length === 0 ? (
        <div className="empty-state"><h2>{t("endpoints.empty.title")}</h2><p>{t("endpoints.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("endpoints.columns.ip")}</th><th>{t("endpoints.columns.priority")}</th><th>{t("endpoints.columns.weight")}</th><th>{t("endpoints.columns.status")}</th><th>{t("endpoints.columns.actions")}</th></tr></thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.id}>
                <td className="mono">{endpoint.ip}</td>
                <td>{endpoint.priority}</td>
                <td>{endpoint.weight}</td>
                <td>{getStatusBadge(endpoint.status)}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
