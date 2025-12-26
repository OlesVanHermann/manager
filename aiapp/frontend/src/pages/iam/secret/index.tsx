// ============================================================
// SECRET PAGE - Secret Manager OVHcloud
// NAV1: iam | NAV2: secret | Tabs: secrets, versions, access
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { SecretManager } from "./secret.types";
import SecretsTab from "./tabs/secrets/SecretsTab";
import VersionsTab from "./tabs/versions/VersionsTab";
import AccessTab from "./tabs/access/AccessTab";
import "./SecretPage.css";

type SecretTab = "secrets" | "versions" | "access";

export default function SecretManagerPage() {
  const { t } = useTranslation("iam/secret/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";
  const [activeTab, setActiveTab] = useState<SecretTab>("secrets");
  const [info, setInfo] = useState<SecretManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs: { id: SecretTab; label: string }[] = [
    { id: "secrets", label: t("tabs.secrets") },
    { id: "versions", label: t("tabs.versions") },
    { id: "access", label: t("tabs.access") },
  ];

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await ovhGet<SecretManager>(`/secretManager/${serviceId}`);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  if (!serviceId) {
    return (<div className="secret-page-container"><div className="secret-empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>);
  }
  if (loading) {
    return (<div className="secret-page-container"><div className="secret-loading-state">{t("loading")}</div></div>);
  }
  if (error) {
    return (<div className="secret-page-container"><div className="secret-error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>);
  }

  return (
    <div className="secret-page-container">
      <header className="secret-page-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (<div className="secret-service-meta"><span className="secret-meta-item">ID: {info.id}</span><span className="secret-meta-item">Région: {info.region}</span></div>)}
        </div>
      </header>
      <div className="secret-tabs-container">
        <div className="secret-tabs-header">
          {tabs.map((tab) => (<button key={tab.id} className={`secret-tab-button ${activeTab === tab.id ? "active" : ""}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>))}
        </div>
        <div className="secret-tabs-content">
          {activeTab === "secrets" && <SecretsTab serviceId={serviceId} />}
          {activeTab === "versions" && <VersionsTab serviceId={serviceId} />}
          {activeTab === "access" && <AccessTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
