// ============================================================
// IAM GENERAL PAGE - Identity & Access Management
// NAV1: iam | NAV2: general
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IdentitiesTab from "./tabs/identities/IdentitiesTab";
import PoliciesTab from "./tabs/policies/PoliciesTab";
import GroupsTab from "./tabs/groups/GroupsTab";
import LogsTab from "./tabs/logs/LogsTab";
import "./GeneralPage.css";

interface IamGeneralPageProps {
  initialTab?: string;
}

const tabIdMap: Record<string, string> = {
  "iam-identities": "identities",
  "iam-policies": "policies",
  "iam-groups": "groups",
  "iam-logs": "logs",
};

export default function IamGeneralPage({ initialTab = "identities" }: IamGeneralPageProps) {
  const { t } = useTranslation("iam/general/general");
  const [activeTab, setActiveTab] = useState("identities");

  const tabs = [
    { id: "identities", label: t("tabs.identities") },
    { id: "policies", label: t("tabs.policies") },
    { id: "groups", label: t("tabs.groups") },
    { id: "logs", label: t("tabs.logs") },
  ];

  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.some((tab) => tab.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  return (
    <div className="general-page">
      <div className="general-page-header">
        <div className="general-page-header-content">
          <h1>{t("title")}</h1>
          <p className="general-page-description">{t("description")}</p>
        </div>
        <a href="https://docs.ovh.com/fr/iam/" target="_blank" rel="noopener noreferrer" className="general-guides-link">
          {t("docsLink")}
        </a>
      </div>

      <div className="general-tabs-container">
        <nav className="general-tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`general-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="general-content">
        {activeTab === "identities" && <IdentitiesTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}
