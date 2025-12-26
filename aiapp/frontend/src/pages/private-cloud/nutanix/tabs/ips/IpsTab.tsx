// ============================================================
// IPS TAB - Composant isolé pour Nutanix
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { NutanixIp } from "../../nutanix.types";
import { ipsService, getIpStatusBadgeClass, getIpTypeBadgeClass } from "./IpsTab.service";
import "./IpsTab.css";

// ========================================
// TYPES LOCAUX
// ========================================

interface IpsTabProps {
  serviceId: string;
}

// ========================================
// COMPOSANT
// ========================================

export default function IpsTab({ serviceId }: IpsTabProps) {
  const { t } = useTranslation("private-cloud/nutanix/ips");
  const { t: tCommon } = useTranslation("common");

  const [ips, setIps] = useState<NutanixIp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadIps();
  }, [serviceId]);

  const loadIps = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ipsService.getIps(serviceId);
      setIps(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="ips-loading">{tCommon("loading")}</div>;
  }

  if (error) {
    return (
      <div className="ips-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={loadIps}>
          {tCommon("actions.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="ips-tab">
      <div className="ips-toolbar">
        <h2>{t("title")}</h2>
        <button className="btn btn-outline" onClick={loadIps}>
          {tCommon("actions.refresh")}
        </button>
      </div>

      {ips.length === 0 ? (
        <div className="ips-empty">
          <h2>{t("empty.title")}</h2>
          <p>{t("empty.description")}</p>
        </div>
      ) : (
        <table className="ips-table">
          <thead>
            <tr>
              <th>{t("columns.ip")}</th>
              <th>{t("columns.type")}</th>
              <th>{t("columns.description")}</th>
              <th>{t("columns.status")}</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((ip) => (
              <tr key={ip.ip}>
                <td className="ips-address">{ip.ip}</td>
                <td>
                  <span className={`status-badge ${getIpTypeBadgeClass(ip.type)}`}>
                    {ip.type}
                  </span>
                </td>
                <td className="ips-description">{ip.description || "-"}</td>
                <td>
                  <span className={`status-badge ${getIpStatusBadgeClass(ip.status)}`}>
                    {ip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
