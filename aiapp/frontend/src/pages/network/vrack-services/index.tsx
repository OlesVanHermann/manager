// ============================================================
// VRACK SERVICES - vRack Services OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhGet } from "../../../services/api";
import type { VrackServicesInfo } from "./vrack-services.types";

// Imports isolés par tab (sous-dossiers)
import GeneralTab from "./tabs/general/GeneralTab.tsx";
import SubnetsTab from "./tabs/subnets/SubnetsTab.tsx";
import EndpointsTab from "./tabs/endpoints/EndpointsTab.tsx";

// CSS local pour la page
import "./VrackServicesPage.css";

export default function VrackServicesPage() {
  const { t } = useTranslation("network/vrack-services/page");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [service, setService] = useState<VrackServicesInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "subnets", label: t("tabs.subnets") },
    { id: "endpoints", label: t("tabs.endpoints") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) {
      setLoading(false);
      return;
    }
    loadService();
  }, [serviceId]);

  const loadService = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ovhGet<VrackServicesInfo>(`/vrackServices/${serviceId}`);
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string): string => {
    const classes: Record<string, string> = {
      READY: "vrackservices-badge-success",
      CREATING: "vrackservices-badge-warning",
      ERROR: "vrackservices-badge-error",
      DELETING: "vrackservices-badge-error",
    };
    return classes[status] || "";
  };

  if (!serviceId) {
    return (
      <div className="vrackservices-page">
        <div className="vrackservices-empty">
          <h2>{t("noService.title")}</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="vrackservices-page">
        <div className="vrackservices-loading">{t("loading")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vrackservices-page">
        <div className="vrackservices-error">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={loadService}>
            {t("error.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vrackservices-page">
      <header className="vrackservices-header">
        <h1>🌐 {service?.displayName || service?.id}</h1>
        {service && (
          <div className="vrackservices-meta">
            <span className="vrackservices-meta-item">
              Région: {service.region}
            </span>
            <span
              className={`vrackservices-status-badge ${getStatusBadgeClass(service.productStatus)}`}
            >
              {service.productStatus}
            </span>
          </div>
        )}
      </header>

      <TabButtons />

      <div className="vrackservices-tab-content">
        {activeTab === "general" && (
          <GeneralTab
            serviceId={serviceId}
            service={service}
            onRefresh={loadService}
          />
        )}
        {activeTab === "subnets" && <SubnetsTab serviceId={serviceId} />}
        {activeTab === "endpoints" && <EndpointsTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
