import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as cdnService from "../../../../services/network.cdn";

interface CdnStats { requests: number; bandwidth: number; cacheHitRate: number; }
interface StatisticsTabProps { serviceId: string; }

export default function StatisticsTab({ serviceId }: StatisticsTabProps) {
  const { t } = useTranslation("network/cdn/index");
  const { t: tCommon } = useTranslation("common");
  const [stats, setStats] = useState<CdnStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadStats(); }, [serviceId]);

  const loadStats = async () => {
    try { setLoading(true); setError(null); const data = await cdnService.getStatistics(serviceId); setStats(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const formatNumber = (num: number) => new Intl.NumberFormat("fr-FR").format(num);
  const formatBytes = (bytes: number) => {
    if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(2)} GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(2)} MB`;
    return `${bytes} B`;
  };

  if (loading) return <div className="loading-state">{tCommon("loading")}</div>;
  if (error) return <div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadStats}>{tCommon("actions.retry")}</button></div>;

  return (
    <div className="statistics-tab">
      <div className="tab-toolbar"><h2>{t("statistics.title")}</h2><button className="btn btn-outline" onClick={loadStats}>{tCommon("actions.refresh")}</button></div>
      {stats && (
        <div className="stats-card">
          <h3>{t("statistics.last30days")}</h3>
          <div className="stats-grid">
            <div className="stat-item"><div className="stat-value">{formatNumber(stats.requests)}</div><div className="stat-label">{t("statistics.fields.requests")}</div></div>
            <div className="stat-item"><div className="stat-value">{formatBytes(stats.bandwidth)}</div><div className="stat-label">{t("statistics.fields.bandwidth")}</div></div>
            <div className="stat-item"><div className="stat-value">{stats.cacheHitRate}%</div><div className="stat-label">{t("statistics.fields.cacheHit")}</div></div>
          </div>
        </div>
      )}
      <div className="info-card"><h3>{t("statistics.graph.title")}</h3><div className="empty-state" style={{ padding: "var(--space-8)" }}><p>{t("statistics.graph.placeholder")}</p></div></div>
    </div>
  );
}
