import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { IpLoadBalancingFrontend } from "../../load-balancer.types";
import { frontendsService } from "./FrontendsTab";
import "./FrontendsTab.css";

interface Props { serviceName: string; }

export function FrontendsTab({ serviceName }: Props) {
  const { t } = useTranslation("network/load-balancer/index");
  const [frontends, setFrontends] = useState<IpLoadBalancingFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { setLoading(true); const data = await frontendsService.getAllFrontends(serviceName); setFrontends(data); }
      finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="frontends-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="frontends-tab">
      <div className="frontends-header"><h3>{t("frontends.title")}</h3><span className="frontends-count">{frontends.length}</span></div>
      {frontends.length === 0 ? (<div className="frontends-empty"><p>{t("frontends.empty")}</p></div>) : (
        <table className="frontends-table">
          <thead><tr><th>{t("frontends.name")}</th><th>{t("frontends.zone")}</th><th>{t("frontends.port")}</th><th>{t("frontends.ssl")}</th><th>{t("frontends.farm")}</th><th>{t("frontends.status")}</th></tr></thead>
          <tbody>
            {frontends.map(f => (
              <tr key={f.frontendId}>
                <td className="frontends-name">{f.displayName || `Frontend #${f.frontendId}`}</td>
                <td><span className="frontends-badge info">{f.zone}</span></td>
                <td className="frontends-port">{f.port}</td>
                <td>{f.ssl ? <span className="frontends-badge success">SSL</span> : "-"}</td>
                <td>{f.defaultFarmId || "-"}</td>
                <td><span className={`frontends-badge ${f.disabled ? "inactive" : "success"}`}>{f.disabled ? t("frontends.disabled") : t("frontends.enabled")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default FrontendsTab;
