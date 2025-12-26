// ============================================================
// CDN Statistics Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .cdn-statistics-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { CdnStats } from "../../cdn.types";
import { cdnStatisticsService } from "./StatisticsTab.service";
import "./StatisticsTab.css";

interface StatisticsTabProps {
  serviceId: string;
}

export default function StatisticsTab({ serviceId }: StatisticsTabProps) {
  const { t } = useTranslation("network/cdn/statistics");
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
      const data = await cdnStatisticsService.getStatistics(serviceId);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="cdn-statistics-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="cdn-statistics-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadStats}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="cdn-statistics-tab">
      <div className="cdn-statistics-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadStats}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {stats && (
        <div className="cdn-statistics-card">
          <h3>{t("last30days")}</h3>
          <div className="cdn-statistics-grid">
            <div className="cdn-statistics-item">
              <div className="cdn-statistics-value">
                {cdnStatisticsService.formatNumber(stats.requests)}
              </div>
              <div className="cdn-statistics-label">{t("fields.requests")}</div>
            </div>
            <div className="cdn-statistics-item">
              <div className="cdn-statistics-value">
                {cdnStatisticsService.formatBytes(stats.bandwidth)}
              </div>
              <div className="cdn-statistics-label">{t("fields.bandwidth")}</div>
            </div>
            <div className="cdn-statistics-item">
              <div className="cdn-statistics-value">{stats.cacheHitRate}%</div>
              <div className="cdn-statistics-label">{t("fields.cacheHit")}</div>
            </div>
          </div>
        </div>
      )}

      <div className="cdn-statistics-card">
        <h3>{t("graph.title")}</h3>
        <div className="cdn-statistics-graph-placeholder">
          <p>{t("graph.placeholder")}</p>
        </div>
      </div>
    </div>
  );
}
