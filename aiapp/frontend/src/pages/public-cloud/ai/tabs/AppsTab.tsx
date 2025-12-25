// ============================================================
// PUBLIC-CLOUD / AI / APPS - Composant ISOLÉ
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getApps, formatDate, getAppStatusClass } from "./AppsTab.service";
import type { App } from "../ai.types";
import "./AppsTab.css";

interface AppsTabProps {
  projectId: string;
}

export default function AppsTab({ projectId }: AppsTabProps) {
  const { t } = useTranslation("public-cloud/ai/index");
  const { t: tCommon } = useTranslation("common");
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApps();
  }, [projectId]);

  const loadApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApps(projectId);
      setApps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="apps-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="apps-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadApps}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="apps-tab">
      <div className="apps-toolbar">
        <h2>{t("apps.title")}</h2>
        <button className="btn btn-primary">{t("apps.create")}</button>
      </div>

      {apps.length === 0 ? (
        <div className="apps-empty">
          <h2>{t("apps.empty.title")}</h2>
          <p>{t("apps.empty.description")}</p>
        </div>
      ) : (
        <table className="apps-table">
          <thead>
            <tr>
              <th>{t("apps.columns.name")}</th>
              <th>{t("apps.columns.replicas")}</th>
              <th>{t("apps.columns.status")}</th>
              <th>{t("apps.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id}>
                <td>{app.name || app.id}</td>
                <td className="apps-replicas">{app.replicas}</td>
                <td>
                  <span className={`apps-status-badge ${getAppStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td className="apps-actions">
                  {app.url && (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      {t("apps.actions.open")}
                    </a>
                  )}
                  <button className="btn btn-sm btn-outline">
                    {t("apps.actions.scale")}
                  </button>
                  <button className="btn btn-sm btn-outline btn-danger">
                    {tCommon("actions.delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
