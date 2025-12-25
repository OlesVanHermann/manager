// ############################################################
// #  VPS/IPS - COMPOSANT STRICTEMENT ISOLÉ                   #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./IpsTab.css                                #
// #  SERVICE LOCAL : ./IpsTab.ts                             #
// #  I18N LOCAL : bare-metal/vps/ips                         #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ipsService } from "./IpsTab.service";
import type { VpsIp } from "../../vps.types";
import "./IpsTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Composant Principal
// ============================================================
export function IpsTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/ips");
  const [ips, setIps] = useState<VpsIp[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des IPs
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const addresses = await ipsService.listIps(serviceName);
        const data = await Promise.all(
          addresses.map((ip) => ipsService.getIp(serviceName, ip))
        );
        setIps(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // État de chargement
  if (loading) {
    return (
      <div className="vps-ips-tab">
        <div className="vps-ips-loading">
          <div className="vps-ips-skeleton" style={{ width: "80%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="vps-ips-tab">
      {/* En-tête */}
      <div className="vps-ips-header">
        <h3>{t("title")}</h3>
        <span className="vps-ips-count">{ips.length}</span>
      </div>

      {/* Liste vide */}
      {ips.length === 0 ? (
        <div className="vps-ips-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="vps-ips-table">
          <thead>
            <tr>
              <th>{t("address")}</th>
              <th>{t("type")}</th>
              <th>{t("version")}</th>
              <th>{t("gateway")}</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.ipAddress}>
                <td className="vps-ips-mono">{ip.ipAddress}</td>
                <td>
                  <span
                    className={`vps-ips-badge ${ip.type === "primary" ? "vps-ips-success" : "vps-ips-info"}`}
                  >
                    {ip.type}
                  </span>
                </td>
                <td>
                  <span className="vps-ips-badge vps-ips-info">{ip.version}</span>
                </td>
                <td className="vps-ips-mono">{ip.gateway || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IpsTab;
