import { useTranslation } from "react-i18next";

interface CloudConnectInfo { uuid: string; description?: string; status: string; bandwidth: number; pop: string; portSpeed: number; }
interface GeneralTabProps { serviceId: string; service: CloudConnectInfo | null; onRefresh: () => void; }

export default function GeneralTab({ serviceId, service, onRefresh }: GeneralTabProps) {
  const { t } = useTranslation("network/cloud-connect/index");
  const { t: tCommon } = useTranslation("common");
  if (!service) return <div className="loading-state">{tCommon("loading")}</div>;

  const formatBandwidth = (mbps: number) => mbps >= 1000 ? `${mbps / 1000} Gbps` : `${mbps} Mbps`;

  return (
    <div className="general-tab">
      <div className="tab-toolbar"><h2>{t("general.title")}</h2><button className="btn btn-outline" onClick={onRefresh}>{tCommon("actions.refresh")}</button></div>
      <div className="info-grid">
        <div className="info-card"><div className="card-title">{t("general.fields.uuid")}</div><div className="card-value mono" style={{ fontSize: "var(--font-size-sm)" }}>{service.uuid}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.pop")}</div><div className="card-value">{service.pop}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.bandwidth")}</div><div className="card-value">{formatBandwidth(service.bandwidth)}</div></div>
        <div className="info-card"><div className="card-title">{t("general.fields.portSpeed")}</div><div className="card-value">{formatBandwidth(service.portSpeed)}</div></div>
      </div>
      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("general.connection.title")}</h3>
        <div className="connection-line" style={{ marginTop: "var(--space-3)" }}>
          <div className="endpoint"><div className="endpoint-label">{t("general.connection.yourDC")}</div><div className="endpoint-value">Your datacenter</div></div>
          <div className="connector">⟷</div>
          <div className="endpoint"><div className="endpoint-label">{t("general.connection.pop")}</div><div className="endpoint-value">{service.pop}</div></div>
          <div className="connector">⟷</div>
          <div className="endpoint"><div className="endpoint-label">{t("general.connection.ovh")}</div><div className="endpoint-value">OVHcloud Network</div></div>
        </div>
      </div>
    </div>
  );
}
