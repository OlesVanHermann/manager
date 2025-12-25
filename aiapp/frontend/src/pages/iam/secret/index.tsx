// ============================================================
// SECRET MANAGER - Gestion des secrets OVHcloud (DÉFACTORISÉ)
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhGet } from "../../../services/api";
import type { SecretManager } from "./secret.types";
import SecretsTab from "./tabs/secrets/SecretsTab.tsx";
import VersionsTab from "./tabs/versions/VersionsTab.tsx";
import AccessTab from "./tabs/access/AccessTab.tsx";

export default function SecretManagerPage() {
  const { t } = useTranslation("iam/secret/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [info, setInfo] = useState<SecretManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "secrets", label: t("tabs.secrets") },
    { id: "versions", label: t("tabs.versions") },
    { id: "access", label: t("tabs.access") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "secrets");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await ovhGet<SecretManager>(`/secretManager/${serviceId}`);
      setInfo(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content secret-manager-page">
      <header className="page-header">
        <h1>{info?.name || serviceId}</h1>
        {info && (
          <div className="service-meta">
            <span className="meta-item">ID: {info.id}</span>
            <span className="meta-item">Région: {info.region}</span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "secrets" && <SecretsTab serviceId={serviceId} />}
        {activeTab === "versions" && <VersionsTab serviceId={serviceId} />}
        {activeTab === "access" && <AccessTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
