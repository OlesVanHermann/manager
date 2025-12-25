// ============================================================
// IAM LOGS PAGE - Page des logs avec 3 sous-onglets
// Access Policy | Activity | Audit
// Service inliné - CSS isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import AccessPolicyTab from "./tabs/accesspolicy/AccessPolicyTab";
import "./LogsPage.css";

// ============ TYPES ============

type LogTab = "access-policy" | "activity" | "audit";

interface LogsPageProps {
  initialTab?: LogTab;
  onBack?: () => void;
}

// ============ SERVICE (INLINÉ) ============

type LogType = "access-policy" | "activity" | "audit";

async function checkAllLogsAvailability(): Promise<Record<LogType, boolean>> {
  return {
    "access-policy": true,
    activity: true,
    audit: true,
  };
}

// ============ COMPOSANT ============

export default function LogsPage({ initialTab, onBack }: LogsPageProps) {
  const { t } = useTranslation("iam/logs/general");
  const { credentials } = useAuth();

  // ---------- STATE ----------
  const [activeTab, setActiveTab] = useState<LogTab>(initialTab || "access-policy");
  const [availability, setAvailability] = useState<Record<LogType, boolean>>({
    "access-policy": true,
    activity: true,
    audit: true,
  });
  const [loading, setLoading] = useState(true);

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (credentials) {
      loadAvailability();
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
  const loadAvailability = async () => {
    try {
      const result = await checkAllLogsAvailability();
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
      <div className="logspage-container">
        <div className="logspage-error-banner">{t("errors.notAuthenticated")}</div>
      </div>
    );
  }

  const availableTabs = (Object.keys(availability) as LogTab[]).filter(
    (key) => availability[key]
  );

  if (!loading && availableTabs.length === 0) {
    return (
      <div className="logspage-container">
        <div className="logspage-header">
          {onBack && (
            <button className="btn btn-secondary btn-sm" onClick={onBack}>
              ← {t("back")}
            </button>
          )}
          <h1>{t("title")}</h1>
        </div>
        <div className="logspage-empty-state">
          <h3>{t("noLogsAvailable.title")}</h3>
          <p>{t("noLogsAvailable.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="logspage-container">
      <div className="logspage-header">
        {onBack && (
          <button className="btn btn-secondary btn-sm" onClick={onBack}>
            ← {t("back")}
          </button>
        )}
        <h1>{t("title")}</h1>
      </div>

      <div className="logspage-tabs-container">
        <div className="logspage-tabs-header">
          {availability["access-policy"] && (
            <button
              className={`logspage-tab-button ${activeTab === "access-policy" ? "active" : ""}`}
              onClick={() => setActiveTab("access-policy")}
            >
              {t("tabs.accessPolicy")}
            </button>
          )}
          {availability.activity && (
            <button
              className={`logspage-tab-button ${activeTab === "activity" ? "active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              {t("tabs.activity")}
            </button>
          )}
          {availability.audit && (
            <button
              className={`logspage-tab-button ${activeTab === "audit" ? "active" : ""}`}
              onClick={() => setActiveTab("audit")}
            >
              {t("tabs.audit")}
            </button>
          )}
        </div>

        <div className="logspage-tabs-content">
          {loading ? (
            <div className="logspage-loading-state">
              <div className="logspage-spinner"></div>
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
