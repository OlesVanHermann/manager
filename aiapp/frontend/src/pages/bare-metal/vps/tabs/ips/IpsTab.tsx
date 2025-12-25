// ============================================================
// VPS TAB ISOLÉ : IpsTab
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ipsService } from "./IpsTab";
import type { VpsIp } from "../../vps.types";
import "./IpsTab.css";

interface Props {
  serviceName: string;
}

export function IpsTab({ serviceName }: Props) {
  const { t } = useTranslation("bare-metal/vps/index");
  const [ips, setIps] = useState<VpsIp[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const addresses = await ipsService.listIps(serviceName);
        const data = await Promise.all(addresses.map((ip) => ipsService.getIp(serviceName, ip)));
        setIps(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return (
      <div className="ips-tab">
        <div className="tab-loading">
          <div className="skeleton-block" />
        </div>
      </div>
    );
  }

  return (
    <div className="ips-tab">
      <div className="tab-header">
        <h3>{t("ips.title")}</h3>
        <span className="ips-records-count">{ips.length}</span>
      </div>

      {ips.length === 0 ? (
        <div className="empty-state">
          <p>{t("ips.empty")}</p>
        </div>
      ) : (
        <table className="ips-data-table">
          <thead>
            <tr>
              <th>{t("ips.address")}</th>
              <th>{t("ips.version")}</th>
              <th>{t("ips.type")}</th>
              <th>{t("ips.reverse")}</th>
              <th>{t("ips.gateway")}</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.ipAddress}>
                <td className="font-mono">{ip.ipAddress}</td>
                <td>
                  <span className={`badge ${ip.version === "v4" ? "info" : "success"}`}>{ip.version}</span>
                </td>
                <td>
                  <span className={`badge ${ip.type === "primary" ? "success" : "warning"}`}>{ip.type}</span>
                </td>
                <td className="font-mono">{ip.reverse || "-"}</td>
                <td className="font-mono">{ip.gateway || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default IpsTab;
