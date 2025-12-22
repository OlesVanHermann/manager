// ============================================================
// PRIVATE DATABASE TAB: METRICS - Métriques et graphiques
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface Props { serviceName: string; }

type Period = "day" | "week" | "month";

interface MetricData {
  timestamp: number;
  value: number;
}

interface MetricsState {
  memory: MetricData[];
  cpu: MetricData[];
  connections: MetricData[];
  queries: MetricData[];
}

/** Onglet Métriques avec graphiques de performance. */
export function MetricsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [period, setPeriod] = useState<Period>("day");
  const [metrics, setMetrics] = useState<MetricsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOAD ----------
  const loadMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await privateDatabaseService.getMetrics(serviceName, period);
      setMetrics(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName, period]);

  useEffect(() => { loadMetrics(); }, [loadMetrics]);

  // ---------- HELPERS ----------
  const formatValue = (value: number, type: string) => {
    if (type === "memory") return `${(value / 1024 / 1024).toFixed(1)} MB`;
    if (type === "cpu") return `${value.toFixed(1)}%`;
    return value.toString();
  };

  const getMaxValue = (data: MetricData[]) => {
    if (!data || data.length === 0) return 0;
    return Math.max(...data.map(d => d.value));
  };

  const getAvgValue = (data: MetricData[]) => {
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, d) => sum + d.value, 0) / data.length;
  };

  const renderMiniChart = (data: MetricData[], color: string) => {
    if (!data || data.length === 0) {
      return <div className="no-data">Aucune donnée</div>;
    }
    const max = Math.max(...data.map(d => d.value)) || 1;
    const width = 100 / data.length;
    
    return (
      <div className="mini-chart">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((d, i) => `${i * width + width/2},${40 - (d.value / max) * 35}`).join(" ")}
          />
        </svg>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tab-loading">
        <div className="skeleton-block" />
        <div className="skeleton-block" />
      </div>
    );
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  // ---------- RENDER ----------
  return (
    <div className="metrics-tab">
      <div className="tab-header">
        <div>
          <h3>{t("metrics.title")}</h3>
          <p className="tab-description">{t("metrics.description")}</p>
        </div>
        <div className="tab-actions">
          <select 
            className="form-select"
            value={period}
            onChange={(e) => setPeriod(e.target.value as Period)}
          >
            <option value="day">{t("metrics.day")}</option>
            <option value="week">{t("metrics.week")}</option>
            <option value="month">{t("metrics.month")}</option>
          </select>
          <button className="btn btn-secondary btn-sm" onClick={loadMetrics}>
            ↻ {t("metrics.refresh")}
          </button>
        </div>
      </div>

      {/* Grille des métriques */}
      <div className="metrics-grid">
        {/* Mémoire */}
        <section className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📊</span>
            <h4>{t("metrics.memory")}</h4>
          </div>
          <div className="metric-values">
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.current")}</span>
              <span className="stat-value">
                {metrics?.memory?.length ? formatValue(metrics.memory[metrics.memory.length - 1].value, "memory") : "-"}
              </span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.max")}</span>
              <span className="stat-value">{formatValue(getMaxValue(metrics?.memory || []), "memory")}</span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.avg")}</span>
              <span className="stat-value">{formatValue(getAvgValue(metrics?.memory || []), "memory")}</span>
            </div>
          </div>
          {renderMiniChart(metrics?.memory || [], "#3498db")}
        </section>

        {/* CPU */}
        <section className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⚡</span>
            <h4>{t("metrics.cpu")}</h4>
          </div>
          <div className="metric-values">
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.current")}</span>
              <span className="stat-value">
                {metrics?.cpu?.length ? formatValue(metrics.cpu[metrics.cpu.length - 1].value, "cpu") : "-"}
              </span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.max")}</span>
              <span className="stat-value">{formatValue(getMaxValue(metrics?.cpu || []), "cpu")}</span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.avg")}</span>
              <span className="stat-value">{formatValue(getAvgValue(metrics?.cpu || []), "cpu")}</span>
            </div>
          </div>
          {renderMiniChart(metrics?.cpu || [], "#e74c3c")}
        </section>

        {/* Connexions */}
        <section className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🔗</span>
            <h4>{t("metrics.connections")}</h4>
          </div>
          <div className="metric-values">
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.current")}</span>
              <span className="stat-value">
                {metrics?.connections?.length ? metrics.connections[metrics.connections.length - 1].value : "-"}
              </span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.max")}</span>
              <span className="stat-value">{getMaxValue(metrics?.connections || [])}</span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.avg")}</span>
              <span className="stat-value">{getAvgValue(metrics?.connections || []).toFixed(0)}</span>
            </div>
          </div>
          {renderMiniChart(metrics?.connections || [], "#2ecc71")}
        </section>

        {/* Requêtes */}
        <section className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
            <h4>{t("metrics.queries")}</h4>
          </div>
          <div className="metric-values">
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.current")}</span>
              <span className="stat-value">
                {metrics?.queries?.length ? `${metrics.queries[metrics.queries.length - 1].value}/s` : "-"}
              </span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.max")}</span>
              <span className="stat-value">{getMaxValue(metrics?.queries || [])}/s</span>
            </div>
            <div className="metric-stat">
              <span className="stat-label">{t("metrics.avg")}</span>
              <span className="stat-value">{getAvgValue(metrics?.queries || []).toFixed(0)}/s</span>
            </div>
          </div>
          {renderMiniChart(metrics?.queries || [], "#9b59b6")}
        </section>
      </div>

      {/* Info */}
      <div className="info-banner">
        <span className="info-icon">ℹ</span>
        <div>
          <p>{t("metrics.info")}</p>
        </div>
      </div>
    </div>
  );
}

export default MetricsTab;
