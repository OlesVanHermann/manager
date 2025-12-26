// ============================================================
// PUBLIC-CLOUD / DATABASES / METRICS - Composant ISOLÉ
// ============================================================

import { useTranslation } from "react-i18next";
import "./MetricsTab.css";

interface MetricsTabProps {
  projectId: string;
  engine: string;
  serviceId: string;
}

export default function MetricsTab({ projectId, engine, serviceId }: MetricsTabProps) {
  const { t } = useTranslation("public-cloud/databases/metrics");

  return (
    <div className="metrics-tab">
      <div className="metrics-toolbar">
        <h2>{t("title")}</h2>
      </div>

      <div className="metrics-stats-card">
        <h3>{t("current")}</h3>
        <div className="metrics-stats-grid">
          <div className="metrics-stat-item">
            <div className="metrics-stat-value">--</div>
            <div className="metrics-stat-label">{t("fields.cpu")}</div>
          </div>
          <div className="metrics-stat-item">
            <div className="metrics-stat-value">--</div>
            <div className="metrics-stat-label">{t("fields.memory")}</div>
          </div>
          <div className="metrics-stat-item">
            <div className="metrics-stat-value">--</div>
            <div className="metrics-stat-label">{t("fields.storage")}</div>
          </div>
          <div className="metrics-stat-item">
            <div className="metrics-stat-value">--</div>
            <div className="metrics-stat-label">{t("fields.connections")}</div>
          </div>
        </div>
      </div>

      <div className="metrics-graph-card">
        <h3>{t("graph.title")}</h3>
        <div className="metrics-graph-placeholder">
          <p>{t("graph.placeholder")}</p>
        </div>
      </div>
    </div>
  );
}
