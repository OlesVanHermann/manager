// ============================================================
// OKMS - Key Management Service OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as okmsService from "./okms.service";
import type { OkmsInfo } from "./okms.types";
import KeysTab from "./tabs/KeysTab.tsx";
import CredentialsTab from "./tabs/CredentialsTab.tsx";

export default function OkmsPage() {
  const { t } = useTranslation("iam/okms/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [info, setInfo] = useState<OkmsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "keys", label: t("tabs.keys") },
    { id: "credentials", label: t("tabs.credentials") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "keys");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadInfo();
  }, [serviceId]);

  const loadInfo = async () => {
    try {
      setLoading(true); setError(null);
      const data = await okmsService.getOkms(serviceId);
      setInfo(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Erreur inconnue"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { active: "badge-success", pending: "badge-warning", error: "badge-error" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><h2>{t("error.title")}</h2><p>{error}</p><button className="btn btn-primary" onClick={loadInfo}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content okms-page">
      <header className="page-header">
        <h1>{info?.name || serviceId}</h1>
        {info && (
          <div className="service-meta">
            <span className="meta-item">ID: {info.id}</span>
            <span className="meta-item">Région: {info.region}</span>
            <span className="meta-item">{getStatusBadge(info.status)}</span>
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "keys" && <KeysTab serviceId={serviceId} />}
        {activeTab === "credentials" && <CredentialsTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
