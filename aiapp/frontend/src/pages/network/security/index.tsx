// ============================================================
// SECURITY - Protection DDoS et sécurité réseau OVHcloud
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import * as securityService from "../../../services/network.security";
import OverviewTab from "./tabs/OverviewTab";
import AttacksTab from "./tabs/AttacksTab";
import FirewallTab from "./tabs/FirewallTab";
import "../styles.css";

interface IpInfo {
  ip: string;
  routedTo?: { serviceName: string };
  type: string;
  mitigation: string;
  state: string;
}

export default function SecurityPage() {
  const { t } = useTranslation("network/security/index");
  const [searchParams] = useSearchParams();
  const ipBlock = searchParams.get("id") || "";

  const [ip, setIp] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: "overview", label: t("tabs.overview") },
    { id: "attacks", label: t("tabs.attacks") },
    { id: "firewall", label: t("tabs.firewall") },
  ];
  const { activeTab, TabButtons } = useTabs(tabs, "overview");

  useEffect(() => {
    if (!ipBlock) { setLoading(false); return; }
    loadIp();
  }, [ipBlock]);

  const loadIp = async () => {
    try { setLoading(true); setError(null); const data = await securityService.getIp(ipBlock); setIp(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getMitigationBadge = (mitigation: string) => {
    const classes: Record<string, string> = { auto: "badge-success", permanent: "badge-info", off: "badge-secondary" };
    return <span className={`status-badge ${classes[mitigation] || ""}`}>{t(`mitigation.${mitigation}`)}</span>;
  };

  if (!ipBlock) return <div className="page-content"><div className="empty-state"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="page-content"><div className="loading-state">{t("loading")}</div></div>;
  if (error) return <div className="page-content"><div className="error-state"><p>{error}</p><button className="btn btn-primary" onClick={loadIp}>{t("error.retry")}</button></div></div>;

  return (
    <div className="page-content network-page">
      <header className="page-header">
        <h1>🛡️ {t("title")} - {ip?.ip}</h1>
        {ip && (
          <div className="service-meta">
            <span className="meta-item">Type: {ip.type}</span>
            {ip.routedTo && <span className="meta-item">Routé vers: {ip.routedTo.serviceName}</span>}
            {getMitigationBadge(ip.mitigation)}
          </div>
        )}
      </header>
      <TabButtons />
      <div className="tab-content">
        {activeTab === "overview" && <OverviewTab ipBlock={ipBlock} ip={ip} onRefresh={loadIp} />}
        {activeTab === "attacks" && <AttacksTab ipBlock={ipBlock} />}
        {activeTab === "firewall" && <FirewallTab ipBlock={ipBlock} />}
      </div>
    </div>
  );
}
