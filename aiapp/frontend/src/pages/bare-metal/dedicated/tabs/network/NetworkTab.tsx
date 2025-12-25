// ############################################################
// #  DEDICATED/NETWORK - COMPOSANT STRICTEMENT ISOLÉ         #
// #  IMPORTS LOCAUX UNIQUEMENT                               #
// #  CSS LOCAL : ./NetworkTab.css                            #
// #  SERVICE LOCAL : ./NetworkTab.ts                         #
// ############################################################

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { networkService } from "./NetworkTab";
import type { DedicatedServerVrack } from "../../dedicated.types";
import "./NetworkTab.css";

// ============================================================
// Types LOCAUX à ce composant
// ============================================================
interface Props {
  serviceName: string;
}

// ============================================================
// Composant Principal
// ============================================================
export function NetworkTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const [ips, setIps] = useState<string[]>([]);
  const [vracks, setVracks] = useState<DedicatedServerVrack[]>([]);
  const [loading, setLoading] = useState(true);

  // Chargement des données réseau
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ipList, vrackList] = await Promise.all([
          networkService.listIps(serviceName),
          networkService.listVracks(serviceName),
        ]);
        setIps(ipList);
        if (vrackList.length > 0) {
          const vrackDetails = await Promise.all(
            vrackList.map((v) => networkService.getVrack(serviceName, v))
          );
          setVracks(vrackDetails);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  // État de chargement
  if (loading) {
    return (
      <div className="dedicated-network-tab">
        <div className="dedicated-network-loading">
          <div className="dedicated-network-skeleton" style={{ width: "60%" }} />
          <div className="dedicated-network-skeleton" style={{ width: "80%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="dedicated-network-tab">
      {/* Section IPs */}
      <section className="dedicated-network-section">
        <h3>{t("network.ips")}</h3>
        {ips.length === 0 ? (
          <p>{t("network.noIps")}</p>
        ) : (
          <div className="dedicated-network-ip-list">
            {ips.map((ip) => (
              <span key={ip} className="dedicated-network-ip-badge">
                {ip}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Section vRack */}
      <section className="dedicated-network-section">
        <h3>{t("network.vrack")}</h3>
        {vracks.length === 0 ? (
          <p>{t("network.noVrack")}</p>
        ) : (
          <table className="dedicated-network-table">
            <thead>
              <tr>
                <th>{t("network.vrackName")}</th>
                <th>{t("network.vrackState")}</th>
              </tr>
            </thead>
            <tbody>
              {vracks.map((v) => (
                <tr key={v.vrack}>
                  <td className="mono">{v.vrack}</td>
                  <td>
                    <span
                      className={`dedicated-network-badge ${v.state === "ok" ? "success" : "warning"}`}
                    >
                      {v.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default NetworkTab;
