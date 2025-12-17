import { useTranslation } from "react-i18next";

interface IpInfo { ip: string; routedTo?: { serviceName: string }; type: string; mitigation: string; state: string; }
interface OverviewTabProps { ipBlock: string; ip: IpInfo | null; onRefresh: () => void; }

export default function OverviewTab({ ipBlock, ip, onRefresh }: OverviewTabProps) {
  const { t } = useTranslation("network/security/index");
  const { t: tCommon } = useTranslation("common");
  if (!ip) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="overview-tab">
      <div className="tab-toolbar"><h2>{t("overview.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("overview.fields.ip")}</div><div className="card-value mono">{ip.ip}</div></div>
        <div className="info-card"><div className="card-title">{t("overview.fields.type")}</div><div className="card-value">{ip.type}</div></div>
        <div className="info-card"><div className="card-title">{t("overview.fields.state")}</div><div className="card-value">{ip.state}</div></div>
        <div className="info-card"><div className="card-title">{t("overview.fields.routedTo")}</div><div className="card-value">{ip.routedTo?.serviceName || "-"}</div></div>
      </div>
      <div className="stats-card">
        <h3>{t("overview.protection.title")}</h3>
        <div className="stats-grid">
          <div className="stat-item"><div className="stat-value">🟢</div><div className="stat-label">{t("overview.protection.status")}</div></div>
          <div className="stat-item"><div className="stat-value">{t(`mitigation.${ip.mitigation}`)}</div><div className="stat-label">{t("overview.protection.mode")}</div></div>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("overview.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("overview.actions.changeMitigation")}</button>
          <button className="btn btn-outline">{t("overview.actions.enableFirewall")}</button>
        </div>
      </div>
    </div>
  );
}
