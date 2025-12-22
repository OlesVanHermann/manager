// ============================================================
// MODAL: Alertes OOM (Out of Memory) et CPU Throttle
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { privateDatabaseService } from "../../../../../services/web-cloud.private-database";

interface OomEvent {
  date: string;
  sizeReached: number;
}

interface CpuThrottleEvent {
  date: string;
  duration: number;
}

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AlertsModal({ serviceName, isOpen, onClose }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"oom" | "cpu">("oom");
  const [oomEvents, setOomEvents] = useState<OomEvent[]>([]);
  const [cpuEvents, setCpuEvents] = useState<CpuThrottleEvent[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    loadAlerts();
  }, [isOpen, serviceName]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const [oom, cpu] = await Promise.all([
        privateDatabaseService.getOomEvents(serviceName).catch(() => []),
        privateDatabaseService.getCpuThrottleEvents(serviceName).catch(() => []),
      ]);
      setOomEvents(oom || []);
      setCpuEvents(cpu || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR");
  };

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(0)} Mo`;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}min ${seconds % 60}s`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("alerts.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Tabs */}
          <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === "oom" ? "active" : ""}`}
              onClick={() => setActiveTab("oom")}
            >
              {t("alerts.oom.tab")} {oomEvents.length > 0 && <span className="badge error">{oomEvents.length}</span>}
            </button>
            <button
              className={`modal-tab ${activeTab === "cpu" ? "active" : ""}`}
              onClick={() => setActiveTab("cpu")}
            >
              {t("alerts.cpu.tab")} {cpuEvents.length > 0 && <span className="badge warning">{cpuEvents.length}</span>}
            </button>
          </div>

          {loading ? (
            <div className="loading-spinner">{t("common.loading")}</div>
          ) : (
            <>
              {/* OOM Tab */}
              {activeTab === "oom" && (
                <div className="alerts-content">
                  {oomEvents.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">✅</span>
                      <p>{t("alerts.oom.empty")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="info-banner warning">
                        <span className="info-icon">⚠️</span>
                        <span>{t("alerts.oom.description")}</span>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{t("alerts.date")}</th>
                            <th>{t("alerts.oom.sizeReached")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {oomEvents.map((event, i) => (
                            <tr key={i}>
                              <td>{formatDate(event.date)}</td>
                              <td>{formatSize(event.sizeReached)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="info-banner info">
                        <span className="info-icon">💡</span>
                        <span>{t("alerts.oom.recommendation")}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* CPU Tab */}
              {activeTab === "cpu" && (
                <div className="alerts-content">
                  {cpuEvents.length === 0 ? (
                    <div className="empty-state">
                      <span className="empty-icon">✅</span>
                      <p>{t("alerts.cpu.empty")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="info-banner warning">
                        <span className="info-icon">⚠️</span>
                        <span>{t("alerts.cpu.description")}</span>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>{t("alerts.date")}</th>
                            <th>{t("alerts.cpu.duration")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cpuEvents.map((event, i) => (
                            <tr key={i}>
                              <td>{formatDate(event.date)}</td>
                              <td>{formatDuration(event.duration)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="info-banner info">
                        <span className="info-icon">💡</span>
                        <span>{t("alerts.cpu.recommendation")}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>{t("common.close")}</button>
          <button className="btn btn-primary" onClick={() => window.open("https://www.ovhcloud.com/fr/web-cloud/web-cloud-databases/options/", "_blank")}>
            {t("alerts.upgradeRam")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertsModal;
