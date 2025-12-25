import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { metricsService } from "./MetricsTab.service";
import type { PdbMetrics, PdbMetricData } from "../../private-database.types";
import "./MetricsTab.css";

interface Props { serviceName: string; }
type Period = "day" | "week" | "month";

export function MetricsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [period, setPeriod] = useState<Period>("day");
  const [metrics, setMetrics] = useState<PdbMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await metricsService.getMetrics(serviceName, period);
      setMetrics(data);
    } catch (err) { setError(String(err)); }
    finally { setLoading(false); }
  }, [serviceName, period]);

  useEffect(() => { loadMetrics(); }, [loadMetrics]);

  const formatValue = (value: number, type: string) => {
    if (type === "memory") return `${(value / 1024 / 1024).toFixed(1)} MB`;
    if (type === "cpu") return `${value.toFixed(1)}%`;
    return value.toString();
  };

  const getMaxValue = (data: PdbMetricData[]) => data?.length ? Math.max(...data.map(d => d.value)) : 0;
  const getAvgValue = (data: PdbMetricData[]) => data?.length ? data.reduce((s, d) => s + d.value, 0) / data.length : 0;

  const renderMiniChart = (data: PdbMetricData[], color: string) => {
    if (!data?.length) return <div className="metrics-no-data">Aucune donnée</div>;
    const max = Math.max(...data.map(d => d.value)) || 1;
    const width = 100 / data.length;
    return (
      <div className="metrics-mini-chart">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline fill="none" stroke={color} strokeWidth="2"
            points={data.map((d, i) => `${i * width + width/2},${40 - (d.value / max) * 35}`).join(" ")} />
        </svg>
      </div>
    );
  };

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="metrics-tab">
      <div className="metrics-header">
        <div>
          <h3>{t("metrics.title")}</h3>
          <p className="metrics-description">{t("metrics.description")}</p>
        </div>
        <div className="metrics-actions">
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
            <option value="day">{t("metrics.day")}</option>
            <option value="week">{t("metrics.week")}</option>
            <option value="month">{t("metrics.month")}</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={loadMetrics}>↻ {t("metrics.refresh")}</button>
        </div>
      </div>

      <div className="metrics-grid">
        <section className="metrics-card">
          <div className="metrics-card-header"><span className="metrics-icon">📊</span><h4>{t("metrics.memory")}</h4></div>
          <div className="metrics-values">
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.current")}</span>
              <span className="metrics-stat-value">{metrics?.memory?.length ? formatValue(metrics.memory[metrics.memory.length - 1].value, "memory") : "-"}</span></div>
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.max")}</span>
              <span className="metrics-stat-value">{formatValue(getMaxValue(metrics?.memory || []), "memory")}</span></div>
          </div>
          {renderMiniChart(metrics?.memory || [], "#3498db")}
        </section>

        <section className="metrics-card">
          <div className="metrics-card-header"><span className="metrics-icon">⚡</span><h4>{t("metrics.cpu")}</h4></div>
          <div className="metrics-values">
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.current")}</span>
              <span className="metrics-stat-value">{metrics?.cpu?.length ? formatValue(metrics.cpu[metrics.cpu.length - 1].value, "cpu") : "-"}</span></div>
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.max")}</span>
              <span className="metrics-stat-value">{formatValue(getMaxValue(metrics?.cpu || []), "cpu")}</span></div>
          </div>
          {renderMiniChart(metrics?.cpu || [], "#e74c3c")}
        </section>

        <section className="metrics-card">
          <div className="metrics-card-header"><span className="metrics-icon">🔗</span><h4>{t("metrics.connections")}</h4></div>
          <div className="metrics-values">
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.current")}</span>
              <span className="metrics-stat-value">{metrics?.connections?.length ? metrics.connections[metrics.connections.length - 1].value : "-"}</span></div>
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.max")}</span>
              <span className="metrics-stat-value">{getMaxValue(metrics?.connections || [])}</span></div>
          </div>
          {renderMiniChart(metrics?.connections || [], "#2ecc71")}
        </section>

        <section className="metrics-card">
          <div className="metrics-card-header"><span className="metrics-icon">📈</span><h4>{t("metrics.queries")}</h4></div>
          <div className="metrics-values">
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.current")}</span>
              <span className="metrics-stat-value">{metrics?.queries?.length ? `${metrics.queries[metrics.queries.length - 1].value}/s` : "-"}</span></div>
            <div className="metrics-stat"><span className="metrics-stat-label">{t("metrics.max")}</span>
              <span className="metrics-stat-value">{getMaxValue(metrics?.queries || [])}/s</span></div>
          </div>
          {renderMiniChart(metrics?.queries || [], "#9b59b6")}
        </section>
      </div>

      <div className="metrics-info-banner"><span>ℹ</span><p>{t("metrics.info")}</p></div>
    </div>
  );
}

export default MetricsTab;
