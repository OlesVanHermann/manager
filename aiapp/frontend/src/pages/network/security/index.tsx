import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useTabs } from "../../../lib/useTabs";
import { ovhGet } from "../../../services/api";
import type { SecurityIpInfo } from "./security.types";
import OverviewTab from "./tabs/overview/OverviewTab.tsx";
import AttacksTab from "./tabs/attacks/AttacksTab.tsx";
import FirewallTab from "./tabs/firewall/FirewallTab.tsx";
import "./SecurityPage.css";

export default function SecurityPage() {
  const { t } = useTranslation("network/security/index");
  const [searchParams] = useSearchParams();
  const ipBlock = searchParams.get("id") || "";
  const [ip, setIp] = useState<SecurityIpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabs = [{ id: "overview", label: t("tabs.overview") }, { id: "attacks", label: t("tabs.attacks") }, { id: "firewall", label: t("tabs.firewall") }];
  const { activeTab, TabButtons } = useTabs(tabs, "overview");

  useEffect(() => { if (!ipBlock) { setLoading(false); return; } loadIp(); }, [ipBlock]);

  const loadIp = async () => {
    try { setLoading(true); setError(null); const data = await ovhGet<SecurityIpInfo>(`/ip/${encodeURIComponent(ipBlock)}`); setIp(data); }
    catch (err) { setError(err instanceof Error ? err.message : "Erreur"); }
    finally { setLoading(false); }
  };

  const getMitigationBadgeClass = (mitigation: string): string => {
    const classes: Record<string, string> = { auto: "security-badge-success", permanent: "security-badge-info", off: "security-badge-secondary" };
    return classes[mitigation] || "";
  };

  if (!ipBlock) return <div className="security-page"><div className="security-empty"><h2>{t("noService.title")}</h2><p>{t("noService.description")}</p></div></div>;
  if (loading) return <div className="security-page"><div className="security-loading">{t("loading")}</div></div>;
  if (error) return <div className="security-page"><div className="security-error"><p>{error}</p><button className="btn btn-primary" onClick={loadIp}>{t("error.retry")}</button></div></div>;

  return (
    <div className="security-page">
      <header className="security-header">
        <h1>🛡️ {t("title")} - {ip?.ip}</h1>
        {ip && (<div className="security-meta"><span className="security-meta-item">Type: {ip.type}</span>{ip.routedTo && <span className="security-meta-item">Routé vers: {ip.routedTo.serviceName}</span>}<span className={`security-status-badge ${getMitigationBadgeClass(ip.mitigation)}`}>{t(`mitigation.${ip.mitigation}`)}</span></div>)}
      </header>
      <TabButtons />
      <div className="security-tab-content">
        {activeTab === "overview" && <OverviewTab ipBlock={ipBlock} ip={ip} onRefresh={loadIp} />}
        {activeTab === "attacks" && <AttacksTab ipBlock={ipBlock} />}
        {activeTab === "firewall" && <FirewallTab ipBlock={ipBlock} />}
      </div>
    </div>
  );
}
