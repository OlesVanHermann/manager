// ============================================================
// DATABASE STATISTICS TAB - Statistiques bases de données
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { databaseService } from "./DatabaseTab";

interface DatabaseStatisticsTabProps {
  serviceName: string;
}

type Period = "daily" | "weekly" | "monthly" | "yearly";
type AggregateMode = "none" | "daily" | "hourly";

interface DbStats {
  labels: string[];
  values: number[];
}

const PERIODS: Period[] = ["daily", "weekly", "monthly", "yearly"];
const AGGREGATE_MODES: AggregateMode[] = ["none", "daily", "hourly"];

export function DatabaseStatisticsTab({ serviceName }: DatabaseStatisticsTabProps) {
  const { t } = useTranslation("web-cloud/hosting/tabs/database-statistics");
  const [loading, setLoading] = useState(true);
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState<string>("");
  const [period, setPeriod] = useState<Period>("daily");
  const [aggregateMode, setAggregateMode] = useState<AggregateMode>("none");
  const [stats, setStats] = useState<DbStats | null>(null);

  // Charger la liste des BDD
  useEffect(() => {
    const loadDatabases = async () => {
      try {
        const dbs = await databaseService.getDatabases(serviceName);
        setDatabases(dbs || []);
        if (dbs && dbs.length > 0) {
          setSelectedDb(dbs[0]);
        }
      } catch (err) {
        console.error("[DatabaseStatisticsTab] Error loading databases:", err);
      }
    };
    loadDatabases();
  }, [serviceName]);

  // Charger les stats
  const loadStats = useCallback(async () => {
    if (!selectedDb) return;
    try {
      setLoading(true);
      const data = await databaseService.getDatabaseStatistics(serviceName, selectedDb, period);
      setStats(data || { labels: [], values: [] });
    } catch (err) {
      console.error("[DatabaseStatisticsTab] Error:", err);
      setStats({ labels: [], values: [] });
    } finally {
      setLoading(false);
    }
  }, [serviceName, selectedDb, period]);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div className="database-statistics-tab">
      <div className="filters-box">
        <div className="filter-group">
          <label>{t("filters.database")}</label>
          <select 
            value={selectedDb} 
            onChange={(e) => setSelectedDb(e.target.value)}
            disabled={databases.length === 0}
          >
            {databases.map(db => (
              <option key={db} value={db}>{db}</option>
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

      <div className="aggregate-options">
        <span>{t("filters.aggregate")}</span>
        {AGGREGATE_MODES.map(mode => (
          <label key={mode} className="radio-label">
            <input
              type="radio"
              name="dbAggregate"
              checked={aggregateMode === mode}
              onChange={() => setAggregateMode(mode)}
            />
            {t(`aggregates.${mode}`)}
          </label>
        ))}
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner spinner-lg" />
          </div>
        ) : stats && stats.values.length > 0 ? (
          <div className="chart-placeholder">
            <div className="chart-bars">
              {stats.values.slice(0, 12).map((val, i) => (
                <div 
                  key={i} 
                  className="chart-bar"
                  style={{ height: `${Math.min(100, (val / Math.max(...stats.values)) * 100)}%` }}
                  title={`${stats.labels[i]}: ${val}`}
                />
              ))}
            </div>
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

export default DatabaseStatisticsTab;
