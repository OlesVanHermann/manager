// ============================================================
// MODAL: Alerts - Private Database
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { apiClient } from "../../../../../services/api";

interface Props {
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

const BASE_PATH = "/hosting/privateDatabase";

interface OomEvent {
  date: string;
  sizeReached: number;
}

interface CpuThrottleEvent {
  date: string;
  duration: number;
}

export function AlertsModal({ serviceName, isOpen, onClose }: Props) {
  const { t } = useTranslation("web-cloud/private-database/index");
  const [activeTab, setActiveTab] = useState<"oom" | "cpu">("oom");
  const [oomEvents, setOomEvents] = useState<OomEvent[]>([]);
  const [cpuEvents, setCpuEvents] = useState<CpuThrottleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [oom, cpu] = await Promise.all([
        apiClient.get(`${BASE_PATH}/${serviceName}/oom`),
        apiClient.get(`${BASE_PATH}/${serviceName}/cpuThrottle`),
      ]);
      setOomEvents(oom || []);
      setCpuEvents(cpu || []);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    if (isOpen) loadAlerts();
  }, [isOpen, loadAlerts]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("fr-FR");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{t("alerts.title")}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-tabs">
            <button
              className={`modal-tab ${activeTab === "oom" ? "active" : ""}`}
              onClick={() => setActiveTab("oom")}
            >
              OOM <span className="badge">{oomEvents.length}</span>
            </button>
            <button
              className={`modal-tab ${activeTab === "cpu" ? "active" : ""}`}
              onClick={() => setActiveTab("cpu")}
            >
              CPU Throttle <span className="badge">{cpuEvents.length}</span>
            </button>
          </div>

          <div className="alerts-content">
            {loading ? (
              <div className="loading-spinner">{t("common.loading")}</div>
            ) : activeTab === "oom" ? (
              oomEvents.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✅</span>
                  <p>{t("alerts.noOom")}</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Mémoire atteinte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {oomEvents.map((event, i) => (
                      <tr key={i}>
                        <td>{formatDate(event.date)}</td>
                        <td>{(event.sizeReached / 1024 / 1024).toFixed(0)} MB</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            ) : (
              cpuEvents.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">✅</span>
                  <p>{t("alerts.noCpuThrottle")}</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Durée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cpuEvents.map((event, i) => (
                      <tr key={i}>
                        <td>{formatDate(event.date)}</td>
                        <td>{event.duration}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertsModal;
