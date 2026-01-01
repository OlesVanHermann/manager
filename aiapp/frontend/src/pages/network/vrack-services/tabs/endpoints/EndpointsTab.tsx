// ============================================================
// VRACK SERVICES Endpoints Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .vrackservices-endpoints-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { VrackServicesEndpoint } from "../../vrack-services.types";
import { vrackservicesEndpointsService } from "./EndpointsTab.service";
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
      const data = await vrackservicesEndpointsService.getEndpoints(serviceId);
      setEndpoints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpointId: string) => {
    try {
      await vrackservicesEndpointsService.deleteEndpoint(serviceId, endpointId);
      loadEndpoints();
    } catch (err) {
    }
  };

  if (loading) {
    return <div className="vrackservices-endpoints-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="vrackservices-endpoints-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadEndpoints}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="vrackservices-endpoints-tab">
      <div className="vrackservices-endpoints-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-primary">{t("create")}</button>
      </div>

      {endpoints.length === 0 ? (
        <div className="vrackservices-endpoints-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="vrackservices-endpoints-table">
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
                  <span className="vrackservices-endpoints-name">
                    {endpoint.displayName || endpoint.id}
                  </span>
                </td>
                <td>
                  <span className="vrackservices-endpoints-urn">
                    {endpoint.managedServiceUrn}
                  </span>
                </td>
                <td>
                  <div className="vrackservices-endpoints-actions">
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
