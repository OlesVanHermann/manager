// ============================================================
// HOSTING TAB: LOGS - Statistiques et Logs
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Hosting } from "../../../../../services/web-cloud.hosting";

interface Props { 
  serviceName: string; 
  details?: Hosting;
}

type StatType = "http" | "connections" | "bandwidth";
type Period = "day" | "week" | "month";
type GroupBy = "all" | "status";

/** Onglet Statistiques et Logs. */
export function LogsTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/index");
  const [statType, setStatType] = useState<StatType>("http");
  const [period, setPeriod] = useState<Period>("day");
  const [groupBy, setGroupBy] = useState<GroupBy>("all");
  const [selectedDb, setSelectedDb] = useState("");

  const cluster = details?.cluster || serviceName.match(/cluster(\d+)/)?.[1] || '0';
  const statsUrl = `https://logs.cluster${cluster}.hosting.ovh.net/${serviceName}/statistics`;
  const logsUrl = `https://logs.cluster${cluster}.hosting.ovh.net/${serviceName}/logs`;

  return (
    <div className="logs-tab">
      <div className="tab-header">
        <div>
          <h3>{t("logs.title")}</h3>
          <p className="tab-description">{t("logs.description")}</p>
        </div>
      </div>

      {/* Liens externes */}
      <section className="logs-section">
        <div className="external-links-grid">
          <div className="external-link-card">
            <h4>📊 Statistiques web</h4>
            <p>Consultez les statistiques détaillées de fréquentation de vos sites.</p>
            <a 
              href={statsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("logs.viewStats")} ↗
            </a>
          </div>
          <div className="external-link-card">
            <h4>📋 Logs d'accès</h4>
            <p>Accédez aux fichiers de logs bruts pour analyse approfondie.</p>
            <a 
              href={logsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {t("logs.viewLogs")} ↗
            </a>
          </div>
        </div>
      </section>

      {/* Statistiques de l'infrastructure */}
      <section className="logs-section">
        <h4>{t("logs.infraTitle")}</h4>
        
        <div className="stats-controls">
          <div className="control-group">
            <label>{t("logs.type")}</label>
            <select 
              className="form-select"
              value={statType}
              onChange={(e) => setStatType(e.target.value as StatType)}
            >
              <option value="http">{t("logs.httpRequests")}</option>
              <option value="connections">Connexions</option>
              <option value="bandwidth">Bande passante</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>{t("logs.period")}</label>
            <select 
              className="form-select"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Period)}
            >
              <option value="day">{t("logs.day")}</option>
              <option value="week">{t("logs.week")}</option>
              <option value="month">{t("logs.month")}</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>{t("logs.groupBy")}</label>
            <div className="radio-group-inline">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="groupBy" 
                  value="all" 
                  checked={groupBy === "all"}
                  onChange={() => setGroupBy("all")}
                />
                {t("logs.allRequests")}
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="groupBy" 
                  value="status" 
                  checked={groupBy === "status"}
                  onChange={() => setGroupBy("status")}
                />
                {t("logs.byStatus")}
              </label>
            </div>
          </div>
        </div>

        {/* Chart placeholder */}
        <div className="chart-placeholder">
          <div className="chart-mock">
            <svg viewBox="0 0 400 150" className="chart-svg">
              <polyline
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2"
                points="0,120 50,100 100,80 150,90 200,60 250,70 300,40 350,50 400,30"
              />
              <polyline
                fill="none"
                stroke="var(--color-success-500)"
                strokeWidth="2"
                strokeDasharray="5,5"
                points="0,130 50,125 100,110 150,115 200,100 250,105 300,90 350,95 400,80"
              />
            </svg>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color" style={{ background: 'var(--color-primary)' }}></span>
                Requêtes totales
              </span>
              <span className="legend-item">
                <span className="legend-color" style={{ background: 'var(--color-success-500)' }}></span>
                Requêtes réussies (2xx)
              </span>
            </div>
          </div>
          <p className="chart-note">
            Les données détaillées sont disponibles sur l'interface externe Urchin/AWStats.
          </p>
        </div>
      </section>

      {/* Statistiques des bases de données */}
      <section className="logs-section">
        <h4>{t("logs.dbStatsTitle")}</h4>
        
        <div className="stats-controls">
          <div className="control-group">
            <label>Base de données</label>
            <select 
              className="form-select"
              value={selectedDb}
              onChange={(e) => setSelectedDb(e.target.value)}
            >
              <option value="">Sélectionner une base...</option>
              <option value="db1">{serviceName.split('.')[0]}01</option>
            </select>
          </div>
        </div>

        <div className="empty-state-small">
          <p>{t("logs.noStats")}</p>
        </div>
      </section>

      {/* Info aide */}
      <div className="info-banner" style={{ marginTop: 'var(--space-4)' }}>
        <span className="info-icon">ℹ</span>
        <div>
          <p>Les statistiques sont générées quotidiennement à partir des logs d'accès.</p>
          <a 
            href="https://help.ovhcloud.com/csm/fr-web-hosting-statistics-logs"
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary"
          >
            En savoir plus sur les statistiques ↗
          </a>
        </div>
      </div>
    </div>
  );
}

export default LogsTab;
