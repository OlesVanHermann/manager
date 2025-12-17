import { useTranslation } from "react-i18next";

interface MetricsTabProps { projectId: string; engine: string; serviceId: string; }

export default function MetricsTab({ projectId, engine, serviceId }: MetricsTabProps) {
  const { t } = useTranslation("public-cloud/databases/index");

  return (
    <div className="metrics-tab">
      <div className="tab-toolbar"><h2>{t("metrics.title")}</h2></div>
      <div className="stats-card">
        <h3>{t("metrics.current")}</h3>
        <div className="stats-grid">
          <div className="stat-item"><div className="stat-value">--</div><div className="stat-label">{t("metrics.fields.cpu")}</div></div>
          <div className="stat-item"><div className="stat-value">--</div><div className="stat-label">{t("metrics.fields.memory")}</div></div>
          <div className="stat-item"><div className="stat-value">--</div><div className="stat-label">{t("metrics.fields.storage")}</div></div>
          <div className="stat-item"><div className="stat-value">--</div><div className="stat-label">{t("metrics.fields.connections")}</div></div>
        </div>
      </div>
      <div className="info-card"><h3>{t("metrics.graph.title")}</h3><div className="empty-state" style={{ padding: "var(--space-8)" }}><p>{t("metrics.graph.placeholder")}</p></div></div>
    </div>
  );
}
