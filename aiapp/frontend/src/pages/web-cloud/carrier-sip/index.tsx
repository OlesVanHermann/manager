// ============================================================
// CARRIER SIP - Trunk SIP OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as carrierSipService from "../../../services/web-cloud.carrier-sip";
import GeneralTab from "./tabs/GeneralTab";
import EndpointsTab from "./tabs/EndpointsTab";
import CdrTab from "./tabs/CdrTab";
import "../styles.css";

interface CarrierSipInfo {
  serviceName: string;
  description?: string;
  maxCalls: number;
  currentCalls: number;
  status: string;
}

export default function CarrierSipPage() {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id") || "";

  const [trunk, setTrunk] = useState<CarrierSipInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "general", label: t("tabs.general") },
    { id: "endpoints", label: t("tabs.endpoints") },
    { id: "cdr", label: t("tabs.cdr") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "general");

  useEffect(() => {
    if (!serviceId) { setLoading(false); return; }
    loadTrunk();
  }, [serviceId]);

  const loadTrunk = async () => {
    try { setLoading(true); setError(null); const data = await carrierSipService.getTrunk(serviceId); setTrunk(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getStatusBadge = (status: string) => {
    const classes: Record<string, string> = { enabled: "badge-success", disabled: "badge-error", suspended: "badge-warning" };
    return <span className={`status-badge ${classes[status] || ""}`}>{t(`status.${status}`)}</span>;
  };

  if (!serviceId) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadTrunk}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content web-cloud-page">
      <header className="page-header">
        <h1>📞 {trunk?.description || trunk?.serviceName}</h1>
        {trunk && (
          <div className="service-meta">
            <span className="meta-item">{trunk.currentCalls}/{trunk.maxCalls} {t("calls")}</span>
            {getStatusBadge(trunk.status)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "general" && <GeneralTab serviceId={serviceId} trunk={trunk} onRefresh={loadTrunk} />}
        {activeTab === "endpoints" && <EndpointsTab serviceId={serviceId} />}
        {activeTab === "cdr" && <CdrTab serviceId={serviceId} />}
      </div>
    </div>
  );
}
