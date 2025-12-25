// ============================================================
// IAM LOGS DATA PLATFORM - Page des logs avec 3 sous-onglets
// Access Policy | Activity | Audit
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as logsService from "./dbaas-logs.service";
import { AccessPolicyTab, ActivityTab, AuditTab } from "../logs/tabs";


type LogTab = "access-policy" | "activity" | "audit";

export default function DbaasLogsPage() {
  const { t } = useTranslation("iam/logs");
  const [activeTab, setActiveTab] = useState<LogTab>("access-policy");
  const [availability, setAvailability] = useState<Record<logsService.LogType, boolean>>({
    "access-policy": true, activity: true, audit: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAvailability(); }, []);

  useEffect(() => {
    if (!loading && !availability[activeTab]) {
      const first = (Object.keys(availability) as LogTab[]).find((k) => availability[k]);
      if (first) setActiveTab(first);
    }
  }, [availability, loading]);

  const checkAvailability = async () => {
    try {
      const result = await logsService.checkAllLogsAvailability();
      setAvailability(result);
    } catch (err) { console.error("Error checking logs availability:", err); }
    finally { setLoading(false); }
  };

  const availableTabs = (Object.keys(availability) as LogTab[]).filter((k) => availability[k]);

  if (!loading && availableTabs.length === 0) {
    return (
      <div className="logs-page">
        <div className="page-header"><h1>{t("title")}</h1></div>
        <div className="empty-state"><h3>{t("noLogsAvailable.title")}</h3><p>{t("noLogsAvailable.description")}</p></div>
      </div>
    );
  }

  return (
    <div className="logs-page">
      <div className="page-header"><h1>{t("title")}</h1></div>
      <div className="tabs-container">
        <div className="tabs-header">
          {availability["access-policy"] && <button className={`tab-button ${activeTab === "access-policy" ? "active" : ""}`} onClick={() => setActiveTab("access-policy")}>{t("tabs.accessPolicy")}</button>}
          {availability.activity && <button className={`tab-button ${activeTab === "activity" ? "active" : ""}`} onClick={() => setActiveTab("activity")}>{t("tabs.activity")}</button>}
          {availability.audit && <button className={`tab-button ${activeTab === "audit" ? "active" : ""}`} onClick={() => setActiveTab("audit")}>{t("tabs.audit")}</button>}
        </div>
        <div className="tabs-content">
          {loading ? (
            <div className="loading-state"><div className="spinner"></div><p>{t("loading")}</p></div>
          ) : (
            <>
              {activeTab === "access-policy" && <AccessPolicyTab />}
              {activeTab === "activity" && <ActivityTab />}
              {activeTab === "audit" && <AuditTab />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
