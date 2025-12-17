import { useTranslation } from "react-i18next";

interface CarrierSipInfo { serviceName: string; description?: string; maxCalls: number; currentCalls: number; status: string; }
interface GeneralTabProps { serviceId: string; trunk: CarrierSipInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, trunk, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("web-cloud/carrier-sip/index");
  const { t: tCommon } = useTranslation("common");
  if (!trunk) return <div className="loading-state">{tCommon("loading")}</div>;

  const usagePercent = Math.round((trunk.currentCalls / trunk.maxCalls) * 100);
  const getUsageClass = (percent: number) => percent >= 90 ? "danger" : percent >= 70 ? "warning" : "";

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.serviceName")}</div><div className="card-value mono">{trunk.serviceName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.description")}</div><div className="card-value">{trunk.description || "-"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.maxCalls")}</div><div className="card-value">{trunk.maxCalls}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <div className="card-title">{t("general.fields.currentUsage")}</div>
        <div style={{ marginTop: "var(--space-2)" }}>
          <div className="usage-bar"><div className={`usage-fill ${getUsageClass(usagePercent)}`} style={{ width: `${usagePercent}%` }}></div></div>
          <div className="usage-text">{trunk.currentCalls} / {trunk.maxCalls} {t("calls")} ({usagePercent}%)</div>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.sipConfig.title")}</h3>
        <div className="info-grid" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
          <div><div className="card-title">{t("general.sipConfig.server")}</div><div className="card-value mono">sip.ovh.net</div></div>
          <div><div className="card-title">{t("general.sipConfig.port")}</div><div className="card-value mono">5060</div></div>
          <div><div className="card-title">{t("general.sipConfig.transport")}</div><div className="card-value">UDP / TCP / TLS</div></div>
        </div>
      </div>
    </div>
  );
}
