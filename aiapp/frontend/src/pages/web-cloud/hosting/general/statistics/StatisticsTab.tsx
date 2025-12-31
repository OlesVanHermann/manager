// ============================================================
// STATISTICS TAB - Statistiques visiteurs/trafic
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { generalService } from "../general/GeneralTab.service";

interface StatisticsTabProps {
  serviceName: string;
}

type StatType = "IN_HTTP_HITS" | "IN_HTTP_MEAN_RESPONSE_TIME" | "OUT_TCP_CONN" | "SYS_CPU_USAGE" | "SYS_WORKER_SPAWN_OVERLOAD";
type Period = "daily" | "weekly" | "monthly" | "yearly";
type AggregateMode = "none" | "daily" | "hourly";

interface ChartData {
  labels: string[];
  values: number[];
}

const STAT_TYPES: StatType[] = ["IN_HTTP_HITS", "IN_HTTP_MEAN_RESPONSE_TIME", "OUT_TCP_CONN", "SYS_CPU_USAGE", "SYS_WORKER_SPAWN_OVERLOAD"];
const PERIODS: Period[] = ["daily", "weekly", "monthly", "yearly"];
const AGGREGATE_MODES: AggregateMode[] = ["none", "daily", "hourly"];

export function StatisticsTab({ serviceName }: StatisticsTabProps) {
  const { t } = useTranslation("web-cloud/hosting/tabs/statistics");
  const [loading, setLoading] = useState(true);
  const [statType, setStatType] = useState<StatType>("IN_HTTP_HITS");
  const [period, setPeriod] = useState<Period>("daily");
  const [aggregateMode, setAggregateMode] = useState<AggregateMode>("none");
  const [chartData, setChartData] = useState<ChartData | null>(null);

  const loadChart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await generalService.getStatistics(serviceName, statType, period);
      setChartData(data || { labels: [], values: [] });
    } catch (err) {
      console.error("[StatisticsTab] Error:", err);
      setChartData({ labels: [], values: [] });
    } finally {
      setLoading(false);
    }
  }, [serviceName, statType, period]);

  useEffect(() => { loadChart(); }, [loadChart]);

  return (
    <div className="statistics-tab">
      <div className="filters-box">
        <div className="filter-group">
          <label>{t("filters.type")}</label>
          <select value={statType} onChange={(e) => setStatType(e.target.value as StatType)}>
            {STAT_TYPES.map(type => (
              <option key={type} value={type}>{t(`types.${type}`)}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>{t("filters.period")}</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}>
            {PERIODS.map(p => (
              <option key={p} value={p}>{t(`periods.${p}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {statType === "IN_HTTP_HITS" && (
        <div className="aggregate-options">
          <span>{t("filters.aggregate")}</span>
          {AGGREGATE_MODES.map(mode => (
            <label key={mode} className="radio-label">
              <input
                type="radio"
                name="aggregate"
                checked={aggregateMode === mode}
                onChange={() => setAggregateMode(mode)}
              />
              {t(`aggregates.${mode}`)}
            </label>
          ))}
        </div>
      )}

      <div className="chart-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner spinner-lg" />
          </div>
        ) : chartData && chartData.values.length > 0 ? (
          <div className="chart-placeholder">
            <div className="chart-bars">
              {chartData.values.slice(0, 12).map((val, i) => (
                <div 
                  key={i} 
                  className="chart-bar"
                  style={{ height: `${Math.min(100, (val / Math.max(...chartData.values)) * 100)}%` }}
                  title={`${chartData.labels[i]}: ${val}`}
                />
              ))}
            </div>
            <p className="chart-note">{t("chartNote")}</p>
          </div>
        ) : (
          <div className="empty-chart">
            <p>{t("noData")}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatisticsTab;
