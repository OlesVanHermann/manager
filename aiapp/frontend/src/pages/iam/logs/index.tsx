// ============================================================
// IAM LOGS PAGE - Page des logs avec 3 sous-onglets
// Access Policy | Activity | Audit
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import * as logsService from "../../../services/iam.logs";
import { AccessPolicyTab, ActivityTab, AuditTab } from "./tabs";
import "./styles.css";

// ============ TYPES ============

type LogTab = "access-policy" | "activity" | "audit";

interface LogsPageProps {
  initialTab?: LogTab;
  onBack?: () => void;
}

// ============ COMPOSANT ============

export default function LogsPage({ initialTab, onBack }: LogsPageProps) {
  const { t } = useTranslation("iam/logs");
  const { credentials } = useAuth();

  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState<LogTab>(initialTab || "access-policy");
  const [availability, setAvailability] = useState<Record<logsService.LogType, boolean>>({
    "access-policy": true,
    activity: true,
    audit: true,
  });
  const [loading, setLoading] = useState(true);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (credentials) {
      checkAvailability();
    }
  }, [credentials]);

  useEffect(() => {
    if (!loading && !availability[activeTab]) {
      const firstAvailable = (Object.keys(availability) as LogTab[]).find(
        (key) => availability[key]
      );
      if (firstAvailable) {
        setActiveTab(firstAvailable);
      }
    }
  }, [availability, loading]);

  // ---------- LOADERS ----------
  const checkAvailability = async () => {
    if (!credentials) return;
    try {
      const result = await logsService.checkAllLogsAvailability(credentials);
      setAvailability(result);
    } catch (err) {
      console.error("Error checking logs availability:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (!credentials) {
    return (
      <div className="logs-page">
        <div className="error-banner">{t("errors.notAuthenticated")}</div>
      </div>
    );
  }

  const availableTabs = (Object.keys(availability) as LogTab[]).filter(
    (key) => availability[key]
  );

  if (!loading && availableTabs.length === 0) {
    return (
      <div className="logs-page">
        <div className="page-header">
          {onBack && (
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              ← {t("back")}
            </button>
          )}
          <h1>{t("title")}</h1>
        </div>
        <div className="empty-state">
          <h3>{t("noLogsAvailable.title")}</h3>
          <p>{t("noLogsAvailable.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logs-page">
      <div className="page-header">
        {onBack && (
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            ← {t("back")}
          </button>
        )}
        <h1>{t("title")}</h1>
      </div>

      <div className="tabs-container">
        <div className="tabs-header">
          {availability["access-policy"] && (
            <button
              className={`tab-button ${activeTab === "access-policy" ? "active" : ""}`}
              onClick={() => setActiveTab("access-policy")}
            >
              {t("tabs.accessPolicy")}
            </button>
          )}
          {availability.activity && (
            <button
              className={`tab-button ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              {t("tabs.activity")}
            </button>
          )}
          {availability.audit && (
            <button
              className={`tab-button ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => setActiveTab("audit")}
            >
              {t("tabs.audit")}
            </button>
          )}
        </div>

        <div className="tabs-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>{t("loading")}</p>
            </div>
          ) : (
            <>
              {activeTab === "access-policy" && <AccessPolicyTab credentials={credentials} />}
              {activeTab === "activity" && <ActivityTab credentials={credentials} />}
              {activeTab === "audit" && <AuditTab credentials={credentials} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
