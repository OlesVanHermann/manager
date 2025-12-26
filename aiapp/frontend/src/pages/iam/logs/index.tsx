// ============================================================
// IAM LOGS PAGE - Audit & Activity Logs
// NAV1: iam | NAV2: logs | Tabs: audit, activity, accesspolicy
// ============================================================

import { useState } from "react";
import { useTranslation } from "react-i18next";
import AuditTab from "./tabs/audit/AuditTab";
import ActivityTab from "./tabs/activity/ActivityTab";
import AccessPolicyTab from "./tabs/accesspolicy/AccessPolicyTab";
import "./LogsPage.css";

type LogsTab = "audit" | "activity" | "accesspolicy";

export default function LogsPage() {
  const { t } = useTranslation("iam/logs");
  const [activeTab, setActiveTab] = useState<LogsTab>("audit");

  const tabs: { id: LogsTab; label: string }[] = [
    { id: "audit", label: t("tabs.audit") },
    { id: "activity", label: t("tabs.activity") },
    { id: "accesspolicy", label: t("tabs.accesspolicy") },
  ];

  return (
    <div className="logs-page-container">
      <div className="logs-page-header">
        <h1>{t("title")}</h1>
      </div>

      <div className="logs-tabs-container">
        <div className="logs-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`logs-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="logs-tabs-content">
          {activeTab === "audit" && <AuditTab />}
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "accesspolicy" && <AccessPolicyTab />}
        </div>
      </div>
    </div>
  );
}
