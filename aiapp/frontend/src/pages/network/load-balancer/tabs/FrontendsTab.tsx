import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { networkService, IpLoadBalancingFrontend } from "../../../../services/network";

interface Props { serviceName: string; }

export function FrontendsTab({ serviceName }: Props) {
  const { t } = useTranslation("network/load-balancer/index");
  const [frontends, setFrontends] = useState<IpLoadBalancingFrontend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await networkService.listFrontends(serviceName);
        const data = await Promise.all(ids.map(id => networkService.getFrontend(serviceName, id)));
        setFrontends(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="frontends-tab">
      <div className="tab-header"><h3>{t("frontends.title")}</h3><span className="records-count">{frontends.length}</span></div>
      {frontends.length === 0 ? (<div className="empty-state"><p>{t("frontends.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("frontends.name")}</th><th>{t("frontends.zone")}</th><th>{t("frontends.port")}</th><th>{t("frontends.ssl")}</th><th>{t("frontends.farm")}</th><th>{t("frontends.status")}</th></tr></thead>
          <tbody>
            {frontends.map(f => (
              <tr key={f.frontendId}>
                <td>{f.displayName || `Frontend #${f.frontendId}`}</td>
                <td><span className="badge info">{f.zone}</span></td>
                <td className="font-mono">{f.port}</td>
                <td>{f.ssl ? <span className="badge success">SSL</span> : '-'}</td>
                <td>{f.defaultFarmId || '-'}</td>
                <td><span className={`badge ${f.disabled ? 'inactive' : 'success'}`}>{f.disabled ? t("frontends.disabled") : t("frontends.enabled")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default FrontendsTab;
