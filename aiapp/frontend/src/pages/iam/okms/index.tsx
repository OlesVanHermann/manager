// ============================================================
// OKMS PAGE - Key Management Service OVHcloud
// 2 tabs: Keys | Credentials
// Service inliné - CSS isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { OkmsInfo } from "./okms.types";
import KeysTab from "./tabs/keys/KeysTab.tsx";
import CredentialsTab from "./tabs/credentials/CredentialsTab.tsx";
import "./OkmsPage.css";

// ============ TYPES ============

type OkmsTab = "keys" | "credentials";

// ============ SERVICE (INLINÉ) ============

async function getOkms(serviceName: string): Promise<OkmsInfo> {
  return ovhGet<OkmsInfo>(`/okms/resource/${serviceName}`);
}

// ============ COMPOSANT ============

export default function OkmsPage() {
  const { t } = useTranslation("iam/okms/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<OkmsTab>("keys");
  const [info, setInfo] = useState<OkmsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS CONFIG ----------
  const tabs: { id: OkmsTab; label: string }[] = [
    { id: "keys", label: t("tabs.keys") },
    { id: "credentials", label: t("tabs.credentials") },
  ];

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadInfo();
  }, [serviceId]);

  // ---------- LOADERS ----------
  const loadInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOkms(serviceId);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- HELPERS ----------
  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      active: "okmspage-badge-success",
      pending: "okmspage-badge-warning",
      error: "okmspage-badge-error",
    };
    return classes[status] || "";
  };

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="okmspage-container">
        <div className="okmspage-empty-state">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="okmspage-container">
        <div className="okmspage-loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="okmspage-container">
        <div className="okmspage-error-state">
          <h2>{t("error.title")}</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadInfo}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="okmspage-container">
      <header className="okmspage-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (
            <div className="okmspage-service-meta">
              <span className="okmspage-meta-item">ID: {info.id}</span>
              <span className="okmspage-meta-item">Région: {info.region}</span>
              <span className={`okmspage-status-badge ${getStatusBadgeClass(info.status)}`}>
                {t(`status.${info.status}`)}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="okmspage-tabs-container">
        <div className="okmspage-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`okmspage-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="okmspage-tabs-content">
          {activeTab === "keys" && <KeysTab serviceId={serviceId} />}
          {activeTab === "credentials" && <CredentialsTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
