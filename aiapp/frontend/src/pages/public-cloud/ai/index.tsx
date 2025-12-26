// ============================================================
// AI - OVHcloud AI Services (Notebooks, Jobs, Apps)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import NotebooksTab from "./tabs/NotebooksTab";
import JobsTab from "./tabs/JobsTab";
import AppsTab from "./tabs/AppsTab";

export default function AIPage() {
  const { t } = useTranslation("public-cloud/ai/index");
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || "";

  const tabs = [
    { id: "notebooks", label: t("tabs.notebooks") },
    { id: "jobs", label: t("tabs.jobs") },
    { id: "apps", label: t("tabs.apps") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "notebooks");

  if (!projectId) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>{t("noProject.title")}</h2>
          <p>{t("noProject.description")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content public-cloud-page">
      <header className="page-header">
        <h1>🤖 {t("title")}</h1>
        <p className="page-description">{t("description")}</p>
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "notebooks" && <NotebooksTab projectId={projectId} />}
        {activeTab === "jobs" && <JobsTab projectId={projectId} />}
        {activeTab === "apps" && <AppsTab projectId={projectId} />}
      </div>
    </div>
  );
}
