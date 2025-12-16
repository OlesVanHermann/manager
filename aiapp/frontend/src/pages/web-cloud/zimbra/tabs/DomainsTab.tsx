import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { zimbraService, ZimbraDomain } from "../../../../services/zimbra.service";

interface Props { serviceId: string; }

export function DomainsTab({ serviceId }: Props) {
  const { t } = useTranslation("web-cloud/zimbra/index");
  const [domains, setDomains] = useState<ZimbraDomain[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ids = await zimbraService.listDomains(serviceId);
        const data = await Promise.all(ids.map(id => zimbraService.getDomain(serviceId, id)));
        setDomains(data);
      } finally { setLoading(false); }
    };
    load();
  }, [serviceId]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="domains-tab">
      <div className="tab-header"><h3>{t("domains.title")}</h3></div>
      {domains.length === 0 ? (<div className="empty-state"><p>{t("domains.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("domains.name")}</th><th>{t("domains.type")}</th><th>{t("domains.status")}</th></tr></thead>
          <tbody>
            {domains.map(d => (
              <tr key={d.id}>
                <td className="font-mono">{d.name}</td>
                <td>{d.type}</td>
                <td><span className={`badge ${d.status === 'ok' ? 'success' : 'warning'}`}>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default DomainsTab;
