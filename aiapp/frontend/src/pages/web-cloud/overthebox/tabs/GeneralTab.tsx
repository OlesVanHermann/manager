import { useTranslation } from "react-i18next";

interface OtbInfo { serviceName: string; customerDescription?: string; status: string; releaseChannel: string; systemVersion?: string; tunnelMode: string; }
interface GeneralTabProps { serviceId: string; otb: OtbInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, otb, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("web-cloud/overthebox/index");
  const { t: tCommon } = useTranslation("common");
  if (!otb) return <div className="loading-state">{tCommon("loading")}</div>;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.serviceName")}</div><div className="card-value mono">{otb.serviceName}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.description")}</div><div className="card-value">{otb.customerDescription || "-"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.channel")}</div><div className="card-value">{otb.releaseChannel}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.version")}</div><div className="card-value">{otb.systemVersion || "-"}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.tunnelMode")}</div><div className="card-value">{otb.tunnelMode}</div></div>
      </div>
      <div className="bandwidth-card">
        <h3>{t("general.bandwidth.title")}</h3>
        <div className="bandwidth-stats">
          <div className="bandwidth-stat"><div className="stat-value">--</div><div className="stat-label">{t("general.bandwidth.download")}</div></div>
          <div className="bandwidth-stat"><div className="stat-value">--</div><div className="stat-label">{t("general.bandwidth.upload")}</div></div>
          <div className="bandwidth-stat"><div className="stat-value">--</div><div className="stat-label">{t("general.bandwidth.latency")}</div></div>
        </div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.actions.title")}</h3>
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("general.actions.rename")}</button>
          <button className="btn btn-outline">{t("general.actions.reboot")}</button>
          <button className="btn btn-outline">{t("general.actions.changeChannel")}</button>
        </div>
      </div>
    </div>
  );
}
