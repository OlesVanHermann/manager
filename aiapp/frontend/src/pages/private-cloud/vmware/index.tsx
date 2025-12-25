import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";

// Service isolé pour le chargement initial
import { generalService } from "./tabs/general/GeneralTab.ts";
import type { DedicatedCloud } from "./vmware.types";

// Imports des composants TSX
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import DatacentersTab from "./tabs/datacenters/DatacentersTab.tsx";
import HostsTab from "./tabs/hosts/HostsTab.tsx";
import DatastoresTab from "./tabs/datastores/DatastoresTab.tsx";
import UsersTab from "./tabs/users/UsersTab.tsx";
import SecurityTab from "./tabs/security/SecurityTab.tsx";
import LicenseTab from "./tabs/license/LicenseTab.tsx";
import OperationsTab from "./tabs/operations/OperationsTab.tsx";
import TasksTab from "./tabs/tasks/TasksTab.tsx";

import "./vmware.css";

export default function VmwarePage() {
  const { t } = useTranslation("private-cloud/vmware/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [service, setService] = useState<DedicatedCloud | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "datacenters", label: t("tabs.datacenters") },
    { id: "hosts", label: t("tabs.hosts") },
    { id: "datastores", label: t("tabs.datastores") },
    { id: "users", label: t("tabs.users") },
    { id: "security", label: t("tabs.security") },
    { id: "license", label: t("tabs.license") },
    { id: "operations", label: t("tabs.operations") },
    { id: "tasks", label: t("tabs.tasks") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => { if (!serviceId) { setLoading(false); return; } loadService(); }, [serviceId]);

  const loadService = async () => {
    try { setLoading(true); setError(null); const data = await generalService.getService(serviceId); setService(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStateBadge = (state: string) => {
    const classes: Record<string, string> = { delivered: "badge-success", toDeliver: "badge-warning", disabled: "badge-error" };
    return <span className={`status-badge ${classes[state] || ""}`}>{t(`states.${state}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadService}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content vmware-page">
      <header className="vmware-page-header">
        <h1>🖥️ {service?.description || service?.serviceName}</h1>
        {service && (
          <div className="vmware-service-meta">
            <span className="vmware-meta-item">Location: {service.location}</span>
            <span className="vmware-meta-item">Version: {service.version}</span>
            <span className="vmware-meta-item">Gamme: {service.commercialRange}</span>
            {getStateBadge(service.state)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} service={service} onRefresh={loadService} />}
        {activeTab === "datacenters" && <DatacentersTab serviceId={serviceId} />}
        {activeTab === "hosts" && <HostsTab serviceId={serviceId} />}
        {activeTab === "datastores" && <DatastoresTab serviceId={serviceId} />}
        {activeTab === "users" && <UsersTab serviceId={serviceId} />}
        {activeTab === "security" && <SecurityTab serviceId={serviceId} />}
        {activeTab === "license" && <LicenseTab serviceId={serviceId} />}
        {activeTab === "operations" && <OperationsTab serviceId={serviceId} />}
        {activeTab === "tasks" && <TasksTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
