// ============================================================
// WINDOWS LICENSE - Gestion des licences Windows
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as licenseService from "../../../services/license";
import GeneralTab from "./tabs/GeneralTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

// ============================================================
// TYPES
// ============================================================

interface WindowsLicense {
  id: string;
  ip: string;
  version: string;
  sqlVersion?: string;
  status: string;
  createdAt: string;
}

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/** Page de gestion d'une licence Windows. */
export default function WindowsLicensePage() {
  const { t } = useTranslation("license/index");
  const [searchParams] = useSearchParams();
  const licenseId = searchParams.get("id") || "";

  // ---------- STATE ----------
  const [license, setLicense] = useState<WindowsLicense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS ----------
  const tabs = [
    { id: "general", label: t("windows.tabs.general") },
    { id: "tasks", label: t("windows.tabs.tasks") },
  ];
  const { activeTab, setActiveTab, TabButtons } = useTabs(tabs, "general");

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (!licenseId) {
      setLoading(false);
      return;
    }
    loadLicense();
  }, [licenseId]);

  // ---------- LOADERS ----------
  const loadLicense = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await licenseService.getWindowsLicense(licenseId);
      setLicense(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = {
      ok: "badge-success",
      pending: "badge-warning",
      error: "badge-error",
    };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  // ---------- RENDER ----------
  if (!licenseId) {
    return (
      <div className="page-content">
        <div className="empty-state">
          <h2>{t("windows.noLicense.title")}</h2>
          <p>{t("windows.noLicense.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="error-state">
          <h2>{t("error.title")}</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadLicense}>{t("error.retry")}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content license-page">
      <header className="page-header">
        <h1>🪟 {t("types.windows")} - {license?.ip}</h1>
        {license && (
          <div className="service-meta">
            <span className="meta-item">Version: {license.version}</span>
            {license.sqlVersion && <span className="meta-item">SQL: {license.sqlVersion}</span>}
            <span className="meta-item">{getStatusBadge(license.status)}</span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="tab-content">
        {activeTab === "general" && <GeneralTab licenseId={licenseId} license={license} onRefresh={loadLicense} />}
        {activeTab === "tasks" && <TasksTab licenseId={licenseId} licenseType="windows" />}
      </div>
    </div>
  );
}
