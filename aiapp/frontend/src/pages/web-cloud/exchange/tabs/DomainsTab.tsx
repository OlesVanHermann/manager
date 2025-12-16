import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeDomain } from "../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

export function DomainsTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [domains, setDomains] = useState<ExchangeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await exchangeService.listDomains(org, service);
        const data = await Promise.all(names.map(n => exchangeService.getDomain(org, service, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><h3>{t("domains.title")}</h3></div>
      {domains.length === 0 ? (<div className="empty-state"><p>{t("domains.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("domains.name")}</th><th>{t("domains.type")}</th><th>MX</th><th>SRV</th><th>{t("domains.main")}</th><th>{t("domains.status")}</th></tr></thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.name}>
                <td className="font-mono">{d.name}</td>
                <td>{d.type}</td>
                <td><span className={`badge ${d.mxIsValid ? 'success' : 'error'}`}>{d.mxIsValid ? '✓' : '✗'}</span></td>
                <td><span className={`badge ${d.srvIsValid ? 'success' : 'error'}`}>{d.srvIsValid ? '✓' : '✗'}</span></td>
                <td>{d.main ? '★' : ''}</td>
                <td><span className={`badge ${d.state === 'ok' ? 'success' : 'warning'}`}>{d.state}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default DomainsTab;
