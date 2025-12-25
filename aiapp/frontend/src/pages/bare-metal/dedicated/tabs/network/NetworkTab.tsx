// ============================================================
// DEDICATED TAB ISOLÉ : NetworkTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { networkService } from "./NetworkTab";
import type { DedicatedServerVrack } from "../../dedicated.types";
import "./NetworkTab.css";

interface Props {
  serviceName: string;
}

export function NetworkTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/dedicated/index");
  const [ips, setIps] = useState<string[]>([]);
  const [vracks, setVracks] = useState<DedicatedServerVrack[]>([]);
  const [loading, setLoading] = useState(true);

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
          const vrackDetails = await Promise.all(vrackList.map((v) => networkService.getVrack(serviceName, v)));
          setVracks(vrackDetails);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return (
      <div className="network-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="network-tab">
      <section className="info-section">
        <h3>{t("network.ips")}</h3>
        {ips.length === 0 ? (
          <p>{t("network.noIps")}</p>
        ) : (
          <div className="ip-list">
            {ips.map((ip) => (
              <span key={ip} className="ip-badge font-mono">{ip}</span>
            ))}
          </div>
        )}
      </section>

      <section className="info-section">
        <h3>{t("network.vrack")}</h3>
        {vracks.length === 0 ? (
          <p>{t("network.noVrack")}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("network.vrackName")}</th>
                <th>{t("network.vrackState")}</th>
              </tr>
            </thead>
            <tbody>
              {vracks.map((v) => (
                <tr key={v.vrack}>
                  <td className="font-mono">{v.vrack}</td>
                  <td>
                    <span className={`badge ${v.state === "ok" ? "success" : "warning"}`}>{v.state}</span>
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
