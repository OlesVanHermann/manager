// ============================================================
// VRACK SERVICES Endpoints Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { VrackServicesEndpoint } from "../../vrack-services.types";
import { endpointsService } from "./EndpointsTab.service";
import "./EndpointsTab.css";

interface EndpointsTabProps {
  serviceId: string;
}

export default function EndpointsTab({ serviceId }: EndpointsTabProps) {
  const { t } = useTranslation("network/vrack-services/endpoints");
  const { t: tCommon } = useTranslation("common");
  const [endpoints, setEndpoints] = useState<VrackServicesEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEndpoints();
  }, [serviceId]);

  const loadEndpoints = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await endpointsService.getEndpoints(serviceId);
      setEndpoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpointId: string) => {
    try {
      await endpointsService.deleteEndpoint(serviceId, endpointId);
      loadEndpoints();
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  if (loading) {
    return <div className="endpoints-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="endpoints-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadEndpoints}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="endpoints-tab">
      <div className="endpoints-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {endpoints.length === 0 ? (
        <div className="endpoints-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="endpoints-table">
          <thead>
            <tr>
              <th>{t("columns.name")}</th>
              <th>{t("columns.service")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.id}>
                <td>
                  <span className="endpoints-name">
                    {endpoint.displayName || endpoint.id}
                  </span>
                </td>
                <td>
                  <span className="endpoints-urn">
                    {endpoint.managedServiceUrn}
                  </span>
                </td>
                <td>
                  <div className="endpoints-actions">
                    <button
                      className="btn btn-sm btn-outline btn-danger"
                      onClick={() => handleDelete(endpoint.id)}
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
