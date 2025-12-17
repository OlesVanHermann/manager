// ============================================================
// VMWARE - VMware on OVHcloud (Dedicated Cloud)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as vmwareService from "../../../services/private-cloud.vmware";
import GeneralTab from "./tabs/GeneralTab";
import DatacentersTab from "./tabs/DatacentersTab";
import HostsTab from "./tabs/HostsTab";
import DatastoresTab from "./tabs/DatastoresTab";
import UsersTab from "./tabs/UsersTab";
import SecurityTab from "./tabs/SecurityTab";
import LicenseTab from "./tabs/LicenseTab";
import OperationsTab from "./tabs/OperationsTab";
import TasksTab from "./tabs/TasksTab";
import "../styles.css";

interface DedicatedCloud {
  serviceName: string;
  description?: string;
  location: string;
  managementInterface: string;
  version: string;
  state: string;
  commercialRange: string;
  billingType: string;
}

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
    try { setLoading(true); setError(null); const data = await vmwareService.getService(serviceId); setService(data); }
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
    <div className="page-content private-cloud-page">
      <header className="page-header">
        <h1>🖥️ {service?.description || service?.serviceName}</h1>
        {service && (
          <div className="service-meta">
            <span className="meta-item">Location: {service.location}</span>
            <span className="meta-item">Version: {service.version}</span>
            <span className="meta-item">Gamme: {service.commercialRange}</span>
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
