// ############################################################
// #  VPS/IPS - COMPOSANT STRICTEMENT ISOLÉ                   #
// ############################################################
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ipsService } from "./IpsTab";
import type { VpsIp } from "../../vps.types";
import "./IpsTab.css";

interface Props { serviceName: string; }

export function IpsTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [ips, setIps] = useState<VpsIp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const addresses = await ipsService.listIps(serviceName); setIps(await Promise.all(addresses.map((ip) => ipsService.getIp(serviceName, ip)))); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="vps-ips-tab"><div className="vps-ips-loading"><div className="vps-ips-skeleton" style={{ width: "80%" }} /></div></div>;

  return (
    <div className="vps-ips-tab">
      <div className="vps-ips-header"><h3>{t("ips.title")}</h3><span className="vps-ips-count">{ips.length}</span></div>
      {ips.length === 0 ? <div className="vps-ips-empty"><p>{t("ips.empty")}</p></div> : (
        <table className="vps-ips-table">
          <thead><tr><th>{t("ips.address")}</th><th>{t("ips.type")}</th><th>{t("ips.version")}</th><th>{t("ips.gateway")}</th></tr></thead>
          <tbody>{ips.map((ip) => (<tr key={ip.ipAddress}><td className="mono">{ip.ipAddress}</td><td><span className={`vps-ips-badge ${ip.type === "primary" ? "success" : "info"}`}>{ip.type}</span></td><td><span className="vps-ips-badge info">{ip.version}</span></td><td className="mono">{ip.gateway || "-"}</td></tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
export default IpsTab;
