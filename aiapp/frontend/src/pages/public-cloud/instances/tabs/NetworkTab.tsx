import { useTranslation } from "react-i18next";
import "./NetworkTab.css";

interface InstanceInfo { id: string; name: string; flavorId: string; flavorName: string; imageId: string; imageName: string; region: string; status: string; created: string; ipAddresses: { ip: string; type: string; version: number }[]; }
interface NetworkTabProps { projectId: string; instanceId: string; instance: InstanceInfo | null; }

export default function NetworkTab({ projectId, instanceId, instance }: NetworkTabProps) {
  const { t } = useTranslation("public-cloud/instances/index");
  const { t: tCommon } = useTranslation("common");

  if (!instance) return <div className="loading-state">{tCommon("loading")}</div>;

  const publicIps = instance.ipAddresses.filter(ip => ip.type === "public");
  const privateIps = instance.ipAddresses.filter(ip => ip.type === "private");

  const getVersionBadge = (version: number) => (
    <span className={`status-badge ${version === 4 ? "badge-primary" : "badge-info"}`}>IPv{version}</span>
  );

  return (
    <div className="network-tab">
      <div className="tab-toolbar"><h2>{t("network.title")}</h2></div>
      
      <div className="info-card">
        <h3>{t("network.public.title")}</h3>
        {publicIps.length === 0 ? (
          <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>{t("network.public.none")}</p>
        ) : (
          <table className="data-table" style={{ marginTop: "var(--space-2)" }}>
            <thead><tr><th>{t("network.columns.ip")}</th><th>{t("network.columns.version")}</th></tr></thead>
            <tbody>
              {publicIps.map((ip, idx) => (
                <tr key={idx}><td className="mono">{ip.ip}</td><td>{getVersionBadge(ip.version)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("network.public.attachFloating")}</button>
        </div>
      </div>

      <div className="info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("network.private.title")}</h3>
        {privateIps.length === 0 ? (
          <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-2)" }}>{t("network.private.none")}</p>
        ) : (
          <table className="data-table" style={{ marginTop: "var(--space-2)" }}>
            <thead><tr><th>{t("network.columns.ip")}</th><th>{t("network.columns.version")}</th></tr></thead>
            <tbody>
              {privateIps.map((ip, idx) => (
                <tr key={idx}><td className="mono">{ip.ip}</td><td>{getVersionBadge(ip.version)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="item-actions" style={{ marginTop: "var(--space-3)" }}>
          <button className="btn btn-outline">{t("network.private.attachNetwork")}</button>
        </div>
      </div>
    </div>
  );
}
