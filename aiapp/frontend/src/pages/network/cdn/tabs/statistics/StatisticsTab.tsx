// ============================================================
// CDN Statistics Tab - Composant isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdnStats } from "../../cdn.types";
import { statisticsService } from "./StatisticsTab";
import "./StatisticsTab.css";

interface StatisticsTabProps {
  serviceId: string;
}

export default function StatisticsTab({ serviceId }: StatisticsTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  const [stats, setStats] = useState<CdnStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [serviceId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statisticsService.getStatistics(serviceId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="statistics-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="statistics-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadStats}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="statistics-tab">
      <div className="statistics-toolbar">
        <h2>{t("statistics.title")}</h2>
        <button className="btn btn-outline" onClick={loadStats}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {stats && (
        <div className="statistics-card">
          <h3>{t("statistics.last30days")}</h3>
          <div className="statistics-grid">
            <div className="statistics-item">
              <div className="statistics-value">
                {statisticsService.formatNumber(stats.requests)}
              </div>
              <div className="statistics-label">{t("statistics.fields.requests")}</div>
            </div>
            <div className="statistics-item">
              <div className="statistics-value">
                {statisticsService.formatBytes(stats.bandwidth)}
              </div>
              <div className="statistics-label">{t("statistics.fields.bandwidth")}</div>
            </div>
            <div className="statistics-item">
              <div className="statistics-value">{stats.cacheHitRate}%</div>
              <div className="statistics-label">{t("statistics.fields.cacheHit")}</div>
            </div>
          </div>
        </div>
      )}

      <div className="statistics-card">
        <h3>{t("statistics.graph.title")}</h3>
        <div className="statistics-graph-placeholder">
          <p>{t("statistics.graph.placeholder")}</p>
        </div>
      </div>
    </div>
  );
}
