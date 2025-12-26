// ============================================================
// OKMS PAGE - Key Management Service OVHcloud
// NAV1: iam | NAV2: okms | Tabs: keys, credentials
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { OkmsInfo } from "./okms.types";
import KeysTab from "./tabs/keys/KeysTab";
import CredentialsTab from "./tabs/credentials/CredentialsTab";
import "./OkmsPage.css";

type OkmsTab = "keys" | "credentials";

async function getOkms(serviceName: string): Promise<OkmsInfo> {
  return ovhGet<OkmsInfo>(`/okms/resource/${serviceName}`);
}

export default function OkmsPage() {
  const { t } = useTranslation("iam/okms/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [activeTab, setActiveTab] = useState<OkmsTab>("keys");
  const [info, setInfo] = useState<OkmsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: { id: OkmsTab; label: string }[] = [
    { id: "keys", label: t("tabs.keys") },
    { id: "credentials", label: t("tabs.credentials") },
  ];

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await getOkms(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = { active: "okms-badge-success", pending: "okms-badge-warning", error: "okms-badge-error" };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (<div className="okms-page-container"><div className="okms-empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>);
  }
  if (loading) {
    return (<div className="okms-page-container"><div className="okms-loading-state">{t("loading")}</div></div>);
  }
  if (error) {
    return (<div className="okms-page-container"><div className="okms-error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>);
  }

  return (
    <div className="okms-page-container">
      <header className="okms-page-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (<div className="okms-service-meta"><span className="okms-meta-item">ID: {info.id}</span><span className="okms-meta-item">Région: {info.region}</span><span className={`okms-status-badge ${getStatusBadgeClass(info.status)}`}>{t(`status.${info.status}`)}</span></div>)}
        </div>
      </header>
      <div className="okms-tabs-container">
        <div className="okms-tabs-header">
          {tabs.map((tab) => (<button key={tab.id} className={`okms-tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
        </div>
        <div className="okms-tabs-content">
          {activeTab === "keys" && <KeysTab serviceId={serviceId} />}
          {activeTab === "credentials" && <CredentialsTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
