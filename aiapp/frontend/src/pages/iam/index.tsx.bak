// ============================================================
// IAM PAGE - Identity & Access Management
// Univers autonome - Section Accueil avec 4 tabs (NAV3)
// IMPORTS DIRECTS (pas de barrel file)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import IdentitiesTab from "./tabs/identities/IdentitiesTab";
import PoliciesTab from "./tabs/policies/PoliciesTab";
import GroupsTab from "./tabs/groups/GroupsTab";
import LogsTab from "./tabs/logs/LogsTab";
import "./IamPage.css";

// ============ TYPES ============

interface IamPageProps {
  initialTab?: string;
}

// ============ CONSTANTES ============

const tabIdMap: Record<string, string> = {
  "iam-identities": "identities",
  "iam-policies": "policies",
  "iam-groups": "groups",
  "iam-logs": "logs",
};

// ============ COMPOSANT ============

/** Page IAM avec 4 onglets: Identities, Policies, Groups, Logs. */
export default function IamPage({ initialTab = "identities" }: IamPageProps) {
  const { t } = useTranslation("iam/general/general");
  const [activeTab, setActiveTab] = useState("identities");

  const tabs = [
    { id: "identities", label: t("tabs.identities") },
    { id: "policies", label: t("tabs.policies") },
    { id: "groups", label: t("tabs.groups") },
    { id: "logs", label: t("tabs.logs") },
  ];

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (initialTab) {
      const mappedTab = tabIdMap[initialTab] || initialTab;
      if (tabs.some((tab) => tab.id === mappedTab)) {
        setActiveTab(mappedTab);
      }
    }
  }, [initialTab]);

  // ---------- RENDER ----------
  return (
    <div className="iam-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1>{t("title")}</h1>
          <p className="page-description">{t("description")}</p>
        </div>
        <a href="https://docs.ovh.com/fr/iam/" target="_blank" rel="noopener noreferrer" className="guides-link">
          {t("docsLink")}
        </a>
      </div>

      <div className="tabs-container">
        <nav className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="iam-content">
        {activeTab === "identities" && <IdentitiesTab />}
        {activeTab === "policies" && <PoliciesTab />}
        {activeTab === "groups" && <GroupsTab />}
        {activeTab === "logs" && <LogsTab />}
      </div>
    </div>
  );
}
