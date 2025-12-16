import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { officeService, OfficeDomain } from "../../../../services/web-cloud.office";

interface Props { serviceName: string; }

export function DomainsTab({ serviceName }: Props) {
  const { t } = useTranslation("web-cloud/office/index");
  const [domains, setDomains] = useState<OfficeDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const names = await officeService.listDomains(serviceName);
        const data = await Promise.all(names.map(n => officeService.getDomain(serviceName, n)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceName]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><h3>{t("domains.title")}</h3></div>
      {domains.length === 0 ? (<div className="empty-state"><p>{t("domains.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("domains.name")}</th><th>{t("domains.status")}</th><th>{t("domains.txtRecord")}</th></tr></thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.domainName}>
                <td className="font-mono">{d.domainName}</td>
                <td><span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span></td>
                <td className="font-mono" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.txtEntry || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default DomainsTab;
