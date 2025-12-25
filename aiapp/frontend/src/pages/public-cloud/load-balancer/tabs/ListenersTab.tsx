// ============================================================
// PUBLIC-CLOUD / LOAD-BALANCER / LISTENERS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getListeners, getListenerStatusClass } from "./ListenersTab";
import type { Listener } from "../load-balancer.types";
import "./ListenersTab.css";

interface ListenersTabProps {
  projectId: string;
  lbId: string;
}

export default function ListenersTab({ projectId, lbId }: ListenersTabProps) {
  const { t } = useTranslation("public-cloud/load-balancer/index");
  const { t: tCommon } = useTranslation("common");
  const [listeners, setListeners] = useState<Listener[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadListeners();
  }, [projectId, lbId]);

  const loadListeners = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getListeners(projectId, lbId);
      setListeners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="listeners-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="listeners-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadListeners}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="listeners-tab">
      <div className="listeners-toolbar">
        <h2>{t("listeners.title")}</h2>
        <button className="btn btn-primary">{t("listeners.add")}</button>
      </div>

      {listeners.length === 0 ? (
        <div className="listeners-empty">
          <h2>{t("listeners.empty.title")}</h2>
          <p>{t("listeners.empty.description")}</p>
        </div>
      ) : (
        <table className="listeners-table">
          <thead>
            <tr>
              <th>{t("listeners.columns.name")}</th>
              <th>{t("listeners.columns.protocol")}</th>
              <th>{t("listeners.columns.port")}</th>
              <th>{t("listeners.columns.status")}</th>
              <th>{t("listeners.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {listeners.map((listener) => (
              <tr key={listener.id}>
                <td>{listener.name}</td>
                <td>{listener.protocol}</td>
                <td className="listeners-port">{listener.port}</td>
                <td>
                  <span className={`listeners-status-badge ${getListenerStatusClass(listener.status)}`}>
                    {listener.status}
                  </span>
                </td>
                <td className="listeners-actions">
                  <button className="btn btn-sm btn-outline">{tCommon("actions.edit")}</button>
                  <button className="btn btn-sm btn-outline btn-danger">{tCommon("actions.delete")}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
