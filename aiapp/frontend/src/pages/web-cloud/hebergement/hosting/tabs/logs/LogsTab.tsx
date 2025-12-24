// ============================================================
import "./LogsTab.css";
// HOSTING TAB: LOGS - Statistiques et logs
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { logsService } from "./LogsTab";
import type { Hosting, OwnLog } from "../../hosting.types";
import { UserLogsModal } from "./modals";

interface Props { 
  serviceName: string;
  details?: Hosting;
}

type SubTab = "stats" | "logs";

export function LogsTab({ serviceName, details }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.logs");
  const [hosting, setHosting] = useState<Hosting | null>(details || null);
  const [ownLogs, setOwnLogs] = useState<OwnLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("stats");

  // Stats filters
  const [statsType, setStatsType] = useState("http");
  const [statsPeriod, setStatsPeriod] = useState("week");

  // Modal
  const [showUserLogsModal, setShowUserLogsModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [hostingData, logs] = await Promise.all([
        details ? Promise.resolve(details) : logsService.getHosting(serviceName),
        logsService.listOwnLogs(serviceName).catch(() => [])
      ]);
      setHosting(hostingData);
      if (Array.isArray(logs)) {
        const logsData = await Promise.all(logs.map(id => logsService.getOwnLog(serviceName, id).catch(() => null)));
        setOwnLogs(logsData.filter(Boolean) as OwnLog[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [serviceName, details]);

  useEffect(() => { loadData(); }, [loadData]);

  const statsUrl = hosting?.cluster ? `https://logs.ovh.net/${serviceName}/` : null;
  const logsUrl = hosting?.cluster ? `https://logs.ovh.net/${serviceName}/logs/` : null;

  if (loading) return <div className="tab-loading"><div className="skeleton-block" style={{ height: "400px" }} /></div>;

  return (
    <div className="logs-tab">
      {/* Header */}
      <div className="tab-header">
        <div>
          <h3>{t("logs.title")}</h3>
          <p className="tab-description">{t("logs.description")}</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="sub-tabs">
        <button 
          className={`sub-tab ${activeSubTab === "stats" ? "active" : ""}`}
          onClick={() => setActiveSubTab("stats")}
        >
          Statistiques
        </button>
        <button 
          className={`sub-tab ${activeSubTab === "logs" ? "active" : ""}`}
          onClick={() => setActiveSubTab("logs")}
        >
          Logs
        </button>
      </div>

      {/* STATS TAB */}
      {activeSubTab === "stats" && (
        <div className="stats-content">
          {/* Filters */}
          <div className="stats-filters">
            <div className="filter-group">
              <label>{t("logs.type")} :</label>
              <select 
                className="form-select"
                value={statsType}
                onChange={(e) => setStatsType(e.target.value)}
              >
                <option value="http">{t("logs.httpRequests")}</option>
                <option value="ftp">FTP</option>
                <option value="ssh">SSH</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{t("logs.period")} :</label>
              <select 
                className="form-select"
                value={statsPeriod}
                onChange={(e) => setStatsPeriod(e.target.value)}
              >
                <option value="day">{t("logs.day")}</option>
                <option value="week">{t("logs.week")}</option>
                <option value="month">{t("logs.month")}</option>
              </select>
            </div>
          </div>

          {/* Chart placeholder */}
          <div className="stats-chart-container">
            <h4 className="chart-title">Requêtes HTTP - Dernière semaine</h4>
            <div className="chart-placeholder">
              <div className="chart-bars">
                <div className="bar" style={{ height: "60%" }}><span>Lun</span></div>
                <div className="bar" style={{ height: "75%" }}><span>Mar</span></div>
                <div className="bar" style={{ height: "90%" }}><span>Mer</span></div>
                <div className="bar" style={{ height: "65%" }}><span>Jeu</span></div>
                <div className="bar" style={{ height: "80%" }}><span>Ven</span></div>
                <div className="bar" style={{ height: "95%" }}><span>Sam</span></div>
                <div className="bar" style={{ height: "45%" }}><span>Dim</span></div>
              </div>
            </div>
            {statsUrl && (
              <a href={statsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ marginTop: "1rem" }}>
                {t("logs.viewStats")} ↗
              </a>
            )}
          </div>
        </div>
      )}

      {/* LOGS TAB */}
      {activeSubTab === "logs" && (
        <div className="logs-content">
          <div className="tab-actions" style={{ marginBottom: "1rem" }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowUserLogsModal(true)}>
              {t("logs.manageUsers")}
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Description</th>
                <th>Accès logs</th>
                <th>Accès stats</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* Logs principaux */}
              <tr>
                <td className="font-medium">{serviceName}</td>
                <td>Logs principaux</td>
                <td>
                  <a href={logsUrl || "#"} target="_blank" rel="noopener noreferrer" className="link-action">
                    Accéder aux logs ↗
                  </a>
                </td>
                <td>
                  <a href={statsUrl || "#"} target="_blank" rel="noopener noreferrer" className="link-action">
                    Accéder aux stats ↗
                  </a>
                </td>
                <td>
                  <button className="btn-action-menu">⋮</button>
                </td>
              </tr>
              {/* Logs personnalisés */}
              {ownLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.login}</td>
                  <td>{log.description || "Logs personnalisés"}</td>
                  <td>
                    <a href={`${logsUrl}${log.login}/`} target="_blank" rel="noopener noreferrer" className="link-action">
                      Accéder aux logs ↗
                    </a>
                  </td>
                  <td>
                    <a href={`${statsUrl}${log.login}/`} target="_blank" rel="noopener noreferrer" className="link-action">
                      Accéder aux stats ↗
                    </a>
                  </td>
                  <td>
                    <button className="btn-action-menu">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ownLogs.length === 0 && (
            <p className="empty-hint" style={{ marginTop: "1rem", textAlign: "center", color: "#6B7280" }}>
              Aucun utilisateur de logs personnalisé
            </p>
          )}
        </div>
      )}

      {/* Modal */}
      <UserLogsModal
        serviceName={serviceName}
        isOpen={showUserLogsModal}
        onClose={() => setShowUserLogsModal(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

export default LogsTab;
