import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as vrackServicesService from "../../../../services/network.vrack-services";

interface Endpoint { id: string; displayName?: string; managedServiceUrn: string; }
interface EndpointsTabProps { serviceId: string; }

export default function EndpointsTab({ serviceId }: EndpointsTabProps) {
  const { t } = useTranslation("network/vrack-services/index");
  const { t: tCommon } = useTranslation("common");
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadEndpoints(); }, [serviceId]);

  const loadEndpoints = async () => {
    try { setLoading(true); setError(null); const data = await vrackServicesService.getEndpoints(serviceId); setEndpoints(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadEndpoints}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="endpoints-tab">
      <div className="tab-toolbar"><h2>{t("endpoints.title")}</h2><button className="btn btn-primary">{t("endpoints.create")}</button></div>
      {endpoints.length === 0 ? (
        <div className="empty-state"><h2>{t("endpoints.empty.title")}</h2><p>{t("endpoints.empty.description")}</p></div>
      ) : (
        <table className="data-table">
          <thead><tr><th>{t("endpoints.columns.name")}</th><th>{t("endpoints.columns.service")}</th><th>{t("endpoints.columns.actions")}</th></tr></thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.id}>
                <td>{endpoint.displayName || endpoint.id}</td>
                <td className="mono" style={{ fontSize: "var(--font-size-xs)" }}>{endpoint.managedServiceUrn}</td>
                <td className="item-actions"><button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
