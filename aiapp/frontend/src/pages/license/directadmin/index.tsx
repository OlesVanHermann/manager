import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as licenseService from "../../../services/license";
import GeneralTab from "./tabs/GeneralTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface DirectAdminLicense { id: string; ip: string; version: string; os: string; status: string; createdAt: string; }

export default function DirectAdminLicensePage() {
  const { t } = useTranslation("license/index");
  const [searchParams] = useSearchParams();
  const licenseId = searchParams.get("id") || "";
  const [license, setLicense] = useState<DirectAdminLicense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabs = [{ id: "general", label: t("directadmin.tabs.general") }, { id: "tasks", label: t("directadmin.tabs.tasks") }];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => { if (!licenseId) { setLoading(false); return; } loadLicense(); }, [licenseId]);
  const loadLicense = async () => { try { setLoading(true); setError(null); const data = await licenseService.getDirectAdminLicense(licenseId); setLicense(data); } catch (err) { setError(err instanceof Error ? err.message : "Erreur"); } finally { setLoading(false); } };
  const getStatusBadge = (status: string) => { const classes: Record<string, string> = { ok: "badge-success", pending: "badge-warning", error: "badge-error" }; return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>; };

  if (!licenseId) return <div className="page-content"><div className="empty-state"><h2>{t("directadmin.noLicense.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadLicense}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content license-page">
      <header className="page-header"><h1>⚙️ {t("types.directadmin")} - {license?.ip}</h1>{license && <div className="service-meta"><span className="meta-item">Version: {license.version}</span><span className="meta-item">OS: {license.os}</span>{getStatusBadge(license.status)}</div>}</header>
      <TabButtons />
      <div className="tab-content">{activeTab === "general" && <GeneralTab licenseId={licenseId} license={license} onRefresh={loadLicense} />}{activeTab === "tasks" && <TasksTab licenseId={licenseId} licenseType="directadmin" />}</div>
    </div>
  );
}
