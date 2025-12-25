// ============================================================
// SECRET PAGE - Secret Manager OVHcloud
// 3 tabs: Secrets | Versions | Access
// Service inliné - CSS isolé
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { ovhGet } from "../../../services/api";
import type { SecretManager } from "./secret.types";
import SecretsTab from "./tabs/secrets/SecretsTab.tsx";
import VersionsTab from "./tabs/versions/VersionsTab.tsx";
import AccessTab from "./tabs/access/AccessTab.tsx";
import "./SecretPage.css";

// ============ TYPES ============

type SecretTab = "secrets" | "versions" | "access";

// ============ COMPOSANT ============

export default function SecretManagerPage() {
  const { t } = useTranslation("iam/secret/general");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState<SecretTab>("secrets");
  const [info, setInfo] = useState<SecretManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- TABS CONFIG ----------
  const tabs: { id: SecretTab; label: string }[] = [
    { id: "secrets", label: t("tabs.secrets") },
    { id: "versions", label: t("tabs.versions") },
    { id: "access", label: t("tabs.access") },
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
      const data = await ovhGet<SecretManager>(`/secretManager/${serviceId}`);
      setInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  if (!serviceId) {
    return (
      <div className="secretpage-container">
        <div className="secretpage-empty-state">
          <h2>{t("noService.title")}</h2>
          <p>{t("noService.description")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="secretpage-container">
        <div className="secretpage-loading-state">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="secretpage-container">
        <div className="secretpage-error-state">
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
    <div className="secretpage-container">
      <header className="secretpage-header">
        <div>
          <h1>{info?.name || serviceId}</h1>
          {info && (
            <div className="secretpage-service-meta">
              <span className="secretpage-meta-item">ID: {info.id}</span>
              <span className="secretpage-meta-item">Région: {info.region}</span>
            </div>
          )}
        </div>
      </header>

      <div className="secretpage-tabs-container">
        <div className="secretpage-tabs-header">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`secretpage-tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="secretpage-tabs-content">
          {activeTab === "secrets" && <SecretsTab serviceId={serviceId} />}
          {activeTab === "versions" && <VersionsTab serviceId={serviceId} />}
          {activeTab === "access" && <AccessTab serviceId={serviceId} />}
        </div>
      </div>
    </div>
  );
}
