// ============================================================
// CLOUD DB TAB - Liste des CloudDB liées au hosting
// ============================================================

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../../../../services/api";
import "./CloudDbTab.css";

// ---------- TYPES ----------
interface CloudDbService {
  serviceName: string;
  displayName: string;
  type: "mysql" | "postgresql" | "mariadb" | "redis";
  version: string;
  state: "started" | "stopped" | "maintenance";
  ram: string;
  cpu: number;
  quotaUsed: number;
  quotaSize: number;
}

interface Props {
  serviceName: string;
  onRefresh?: () => void;
}

// ---------- SERVICE ----------
interface CloudDbApiResponse {
  serviceName: string;
  displayName?: string;
  type?: string;
  version?: string;
  state?: string;
  ram?: string;
  cpu?: number;
  quotaUsed?: number;
  quotaSize?: number;
}

const cloudDbService = {
  async listLinkedCloudDb(hostingName: string): Promise<string[]> {
    try {
      // API: GET /hosting/web/{serviceName}/privateDatabases
      const result = await apiClient.get<string[]>(`/hosting/web/${hostingName}/privateDatabases`);
      return result || [];
    } catch {
      return [];
    }
  },

  async getCloudDbDetails(serviceName: string): Promise<CloudDbService | null> {
    try {
      const data = await apiClient.get<CloudDbApiResponse>(`/hosting/privateDatabase/${serviceName}`);
      if (!data) return null;
      return {
        serviceName: data.serviceName,
        displayName: data.displayName || data.serviceName,
        type: (data.type as CloudDbService["type"]) || "mysql",
        version: data.version || "8.0",
        state: (data.state as CloudDbService["state"]) || "started",
        ram: data.ram || "512M",
        cpu: data.cpu || 1,
        quotaUsed: data.quotaUsed || 0,
        quotaSize: data.quotaSize || 1073741824,
      };
    } catch {
      return null;
    }
  },

  async getAllCloudDb(): Promise<string[]> {
    try {
      const result = await apiClient.get<string[]>("/hosting/privateDatabase");
      return result || [];
    } catch {
      return [];
    }
  }
};

// ---------- COMPONENT ----------
export function CloudDbTab({ serviceName, onRefresh: _onRefresh }: Props) {
  const { t } = useTranslation("web-cloud/hosting/web-cloud.hosting.clouddb");
  const navigate = useNavigate();

  const [cloudDbs, setCloudDbs] = useState<CloudDbService[]>([]);
  const [allCloudDbs, setAllCloudDbs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- LOAD DATA ----------
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Charger les CloudDB liées à ce hosting
      const linkedNames = await cloudDbService.listLinkedCloudDb(serviceName);

      // Charger les détails de chaque CloudDB
      const details = await Promise.all(
        linkedNames.map(name => cloudDbService.getCloudDbDetails(name))
      );

      setCloudDbs(details.filter((d): d is CloudDbService => d !== null));

      // Charger tous les CloudDB disponibles (pour le bouton "lier")
      const all = await cloudDbService.getAllCloudDb();
      setAllCloudDbs(all);

    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [serviceName]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---------- HANDLERS ----------
  const handleGoToCloudDb = (dbServiceName: string) => {
    // Relative navigation - goes to sibling route
    navigate(`../clouddb?service=${dbServiceName}`);
  };

  const handleGoToAllCloudDb = () => {
    navigate("../clouddb");
  };

  const handleOpenPhpMyAdmin = (dbServiceName: string) => {
    // Ouvrir phpMyAdmin dans un nouvel onglet
    window.open(`https://phpmyadmin.${dbServiceName}`, "_blank");
  };

  // ---------- RENDER HELPERS ----------
  const formatQuota = (used: number, total: number) => {
    const usedMB = Math.round(used / 1024 / 1024);
    const totalMB = Math.round(total / 1024 / 1024);
    const percent = total > 0 ? Math.round((used / total) * 100) : 0;
    return { usedMB, totalMB, percent };
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "mysql": return "🐬";
      case "mariadb": return "🦭";
      case "postgresql": return "🐘";
      case "redis": return "🔴";
      default: return "🗄️";
    }
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case "started":
        return <span className="wh-clouddb-badge success">{t("status.started")}</span>;
      case "stopped":
        return <span className="wh-clouddb-badge inactive">{t("status.stopped")}</span>;
      case "maintenance":
        return <span className="wh-clouddb-badge warning">{t("status.maintenance")}</span>;
      default:
        return <span className="wh-clouddb-badge">{state}</span>;
    }
  };

  // ---------- LOADING STATE ----------
  if (loading) {
    return (
      <div className="wh-clouddb-loading">
        <div className="wh-clouddb-skeleton" style={{ height: 100, marginBottom: 16 }} />
        <div className="wh-clouddb-skeleton" style={{ height: 200 }} />
      </div>
    );
  }

  // ---------- ERROR STATE ----------
  if (error) {
    return (
      <div className="wh-clouddb-error">
        <span>{t("error.loading")}: {error}</span>
        <button className="wh-clouddb-btn-primary-sm" onClick={loadData}>
          {t("actions.retry")}
        </button>
      </div>
    );
  }

  // ---------- RENDER ----------
  return (
    <div className="wh-clouddb-tab">
      {/* Header */}
      <div className="wh-clouddb-header">
        <div>
          <h3>{t("title")}</h3>
          <p className="wh-clouddb-description">{t("description")}</p>
        </div>
        <div className="wh-clouddb-actions">
          <button
            className="wh-clouddb-btn-secondary"
            onClick={handleGoToAllCloudDb}
          >
            {t("actions.manageAll")}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="wh-clouddb-info-banner">
        <span className="wh-clouddb-info-icon">ℹ️</span>
        <span>{t("info.cloudDbExplanation")}</span>
      </div>

      {/* Content */}
      {cloudDbs.length === 0 ? (
        /* Empty State */
        <div className="wh-clouddb-empty">
          <div className="wh-clouddb-empty-icon">🗄️</div>
          <h4>{t("empty.title")}</h4>
          <p>{t("empty.description")}</p>
          <div className="wh-clouddb-empty-actions">
            {allCloudDbs.length > 0 ? (
              <button
                className="wh-clouddb-btn-primary"
                onClick={handleGoToAllCloudDb}
              >
                {t("actions.linkExisting")}
              </button>
            ) : (
              <button
                className="wh-clouddb-btn-primary"
                onClick={handleGoToAllCloudDb}
              >
                {t("actions.orderNew")}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* CloudDB List */
        <div className="wh-clouddb-list">
          {cloudDbs.map((db) => {
            const quota = formatQuota(db.quotaUsed, db.quotaSize);

            return (
              <div key={db.serviceName} className="wh-clouddb-card">
                {/* Card Header */}
                <div className="wh-clouddb-card-header">
                  <div className="wh-clouddb-card-title">
                    <span className="wh-clouddb-type-icon">{getTypeIcon(db.type)}</span>
                    <div>
                      <h4>{db.displayName}</h4>
                      <span className="wh-clouddb-card-type">
                        {db.type.toUpperCase()} {db.version}
                      </span>
                    </div>
                  </div>
                  {getStatusBadge(db.state)}
                </div>

                {/* Card Stats */}
                <div className="wh-clouddb-card-stats">
                  <div className="wh-clouddb-stat">
                    <span className="wh-clouddb-stat-label">{t("stats.storage")}</span>
                    <div className="wh-clouddb-stat-value">
                      <span>{quota.usedMB} / {quota.totalMB} MB</span>
                      <div className="wh-clouddb-progress">
                        <div
                          className={`wh-clouddb-progress-bar ${quota.percent > 80 ? 'warning' : ''}`}
                          style={{ width: `${quota.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="wh-clouddb-stat">
                    <span className="wh-clouddb-stat-label">{t("stats.ram")}</span>
                    <span className="wh-clouddb-stat-value">{db.ram}</span>
                  </div>
                  <div className="wh-clouddb-stat">
                    <span className="wh-clouddb-stat-label">{t("stats.cpu")}</span>
                    <span className="wh-clouddb-stat-value">{db.cpu} vCore</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="wh-clouddb-card-actions">
                  {(db.type === "mysql" || db.type === "mariadb") && (
                    <button
                      className="wh-clouddb-btn-icon"
                      onClick={() => handleOpenPhpMyAdmin(db.serviceName)}
                      title={t("actions.phpMyAdmin")}
                    >
                      🔧
                    </button>
                  )}
                  <button
                    className="wh-clouddb-btn-primary-sm"
                    onClick={() => handleGoToCloudDb(db.serviceName)}
                  >
                    {t("actions.manage")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All CloudDB Section */}
      {allCloudDbs.length > cloudDbs.length && (
        <div className="wh-clouddb-other-section">
          <h4>{t("otherCloudDbs.title")}</h4>
          <p className="wh-clouddb-other-description">
            {t("otherCloudDbs.description", { count: allCloudDbs.length - cloudDbs.length })}
          </p>
          <button
            className="wh-clouddb-btn-secondary-sm"
            onClick={handleGoToAllCloudDb}
          >
            {t("actions.viewAll")}
          </button>
        </div>
      )}
    </div>
  );
}

export default CloudDbTab;
