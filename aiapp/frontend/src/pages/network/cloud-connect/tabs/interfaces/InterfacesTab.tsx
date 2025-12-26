// ============================================================
// CLOUD CONNECT Interfaces Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cloudconnect-interfaces-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CloudConnectInterface } from "../../cloud-connect.types";
import { cloudconnectInterfacesService } from "./InterfacesTab.service";
import "./InterfacesTab.css";

interface InterfacesTabProps {
  serviceId: string;
}

export default function InterfacesTab({ serviceId }: InterfacesTabProps) {
  const { t } = useTranslation("network/cloud-connect/interfaces");
  const { t: tCommon } = useTranslation("common");
  const [interfaces, setInterfaces] = useState<CloudConnectInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInterfaces();
  }, [serviceId]);

  const loadInterfaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cloudconnectInterfacesService.getInterfaces(serviceId);
      setInterfaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cloudconnect-interfaces-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="cloudconnect-interfaces-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadInterfaces}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="cloudconnect-interfaces-tab">
      <div className="cloudconnect-interfaces-toolbar">
        <h2>{t("title")}</h2>
      </div>

      {interfaces.length === 0 ? (
        <div className="cloudconnect-interfaces-empty">
          <h2>{t("empty.title")}</h2>
        </div>
      ) : (
        <table className="cloudconnect-interfaces-table">
          <thead>
            <tr>
              <th>{t("columns.id")}</th>
              <th>{t("columns.status")}</th>
              <th>{t("columns.light")}</th>
              <th>{t("columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface) => (
              <tr key={iface.id}>
                <td>
                  <span className="cloudconnect-interfaces-id">Interface #{iface.id}</span>
                </td>
                <td>
                  <span
                    className={`cloudconnect-interfaces-status-badge ${cloudconnectInterfacesService.getStatusBadgeClass(iface.status)}`}
                  >
                    {iface.status}
                  </span>
                </td>
                <td>
                  <span className="cloudconnect-interfaces-light-status">
                    {cloudconnectInterfacesService.getLightStatusIcon(iface.lightStatus)}{" "}
                    {iface.lightStatus}
                  </span>
                </td>
                <td>
                  <div className="cloudconnect-interfaces-actions">
                    <button className="btn btn-sm btn-outline">
                      {t("actions.statistics")}
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
