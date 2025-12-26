import { useTranslation } from "react-i18next";
import "./NetworkTab.css";

interface InstanceInfo { id: string; name: string; flavorId: string; flavorName: string; imageId: string; imageName: string; region: string; status: string; created: string; ipAddresses: { ip: string; type: string; version: number }[]; }
interface NetworkTabProps { projectId: string; instanceId: string; instance: InstanceInfo | null; }

export default function NetworkTab({ projectId, instanceId, instance }: NetworkTabProps) {
  const { t } = useTranslation("public-cloud/instances/network");
  const { t: tCommon } = useTranslation("common");

  if (!instance) return <div className="network-loading-state">{tCommon("loading")}</div>;

  const publicIps = instance.ipAddresses.filter(ip => ip.type === "public");
  const privateIps = instance.ipAddresses.filter(ip => ip.type === "private");

  const getVersionBadge = (version: number) => (
    <span className={`network-badge ${version === 4 ? "network-badge-primary" : "network-badge-info"}`}>IPv{version}</span>
  );

  return (
    <div className="network-tab">
      <div className="network-toolbar"><h2>{t("title")}</h2></div>
      
      <div className="network-info-card">
        <h3>{t("public.title")}</h3>
        {publicIps.length === 0 ? (
          <p className="network-empty-text">{t("public.none")}</p>
        ) : (
          <table className="network-data-table">
            <thead><tr><th>{t("columns.ip")}</th><th>{t("columns.version")}</th></tr></thead>
            <tbody>
              {publicIps.map((ip, idx) => (
                <tr key={idx}><td className="network-mono">{ip.ip}</td><td>{getVersionBadge(ip.version)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="network-actions">
          <button className="btn btn-outline">{t("public.attachFloating")}</button>
        </div>
      </div>

      <div className="network-info-card" style={{ marginTop: "var(--space-4)" }}>
        <h3>{t("private.title")}</h3>
        {privateIps.length === 0 ? (
          <p className="network-empty-text">{t("private.none")}</p>
        ) : (
          <table className="network-data-table">
            <thead><tr><th>{t("columns.ip")}</th><th>{t("columns.version")}</th></tr></thead>
            <tbody>
              {privateIps.map((ip, idx) => (
                <tr key={idx}><td className="network-mono">{ip.ip}</td><td>{getVersionBadge(ip.version)}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="network-actions">
          <button className="btn btn-outline">{t("private.attachNetwork")}</button>
        </div>
      </div>
    </div>
  );
}
