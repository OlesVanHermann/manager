// ============================================================
// LOAD BALANCER Frontends Tab - Composant STRICTEMENT isolé
// Préfixe CSS: .lb-frontends-
// ============================================================

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpLoadBalancingFrontend } from "../../load-balancer.types";
import { lbFrontendsService } from "./FrontendsTab.service";
import "./FrontendsTab.css";

interface FrontendsTabProps {
  serviceName: string;
}

export function FrontendsTab({ serviceName }: FrontendsTabProps) {
  const { t } = useTranslation("network/load-balancer/frontends");
  const [frontends, setFrontends] = useState<IpLoadBalancingFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await lbFrontendsService.getAllFrontends(serviceName);
        setFrontends(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [serviceName]);

  if (loading) {
    return (
      <div className="lb-frontends-loading">
        <div className="skeleton-block" />
      </div>
    );
  }

  return (
    <div className="lb-frontends-tab">
      <div className="lb-frontends-header">
        <h3>{t("title")}</h3>
        <span className="lb-frontends-count">{frontends.length}</span>
      </div>

      {frontends.length === 0 ? (
        <div className="lb-frontends-empty">
          <p>{t("empty")}</p>
        </div>
      ) : (
        <table className="lb-frontends-table">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("zone")}</th>
              <th>{t("port")}</th>
              <th>{t("ssl")}</th>
              <th>{t("farm")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {frontends.map((f) => (
              <tr key={f.frontendId}>
                <td className="lb-frontends-name">
                  {f.displayName || `Frontend #${f.frontendId}`}
                </td>
                <td>
                  <span className="lb-frontends-badge lb-frontends-badge-info">{f.zone}</span>
                </td>
                <td className="lb-frontends-port">{f.port}</td>
                <td>
                  {f.ssl ? (
                    <span className="lb-frontends-badge lb-frontends-badge-success">SSL</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{f.defaultFarmId || "-"}</td>
                <td>
                  <span
                    className={`lb-frontends-badge ${f.disabled ? "lb-frontends-badge-inactive" : "lb-frontends-badge-success"}`}
                  >
                    {f.disabled ? t("disabled") : t("enabled")}
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

export default FrontendsTab;
