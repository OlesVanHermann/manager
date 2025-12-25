// ============================================================
// CLOUD CONNECT Interfaces Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CloudConnectInterface } from "../../cloud-connect.types";
import { interfacesService } from "./InterfacesTab.service";
import "./InterfacesTab.css";

interface InterfacesTabProps {
  serviceId: string;
}

export default function InterfacesTab({ serviceId }: InterfacesTabProps) {
  const { t } = useTranslation("network/cloud-connect/index");
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
      const data = await interfacesService.getInterfaces(serviceId);
      setInterfaces(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="interfaces-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="interfaces-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadInterfaces}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="interfaces-tab">
      <div className="interfaces-toolbar">
        <h2>{t("interfaces.title")}</h2>
      </div>

      {interfaces.length === 0 ? (
        <div className="interfaces-empty">
          <h2>{t("interfaces.empty.title")}</h2>
        </div>
      ) : (
        <table className="interfaces-table">
          <thead>
            <tr>
              <th>{t("interfaces.columns.id")}</th>
              <th>{t("interfaces.columns.status")}</th>
              <th>{t("interfaces.columns.light")}</th>
              <th>{t("interfaces.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {interfaces.map((iface) => (
              <tr key={iface.id}>
                <td>
                  <span className="interfaces-id">Interface #{iface.id}</span>
                </td>
                <td>
                  <span
                    className={`interfaces-status-badge ${interfacesService.getStatusBadgeClass(iface.status)}`}
                  >
                    {iface.status}
                  </span>
                </td>
                <td>
                  <span className="interfaces-light-status">
                    {interfacesService.getLightStatusIcon(iface.lightStatus)}{" "}
                    {iface.lightStatus}
                  </span>
                </td>
                <td>
                  <div className="interfaces-actions">
                    <button className="btn btn-sm btn-outline">
                      {t("interfaces.actions.statistics")}
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
