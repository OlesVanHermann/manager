import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeResource } from "../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

export function ResourcesTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [resources, setResources] = useState<ExchangeResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const emails = await exchangeService.listResources(org, service);
        const data = await Promise.all(emails.map(e => exchangeService.getResource(org, service, e)));
        setResources(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="resources-tab">
      <div className="tab-header"><h3>{t("resources.title")}</h3></div>
      {resources.length === 0 ? (<div className="empty-state"><p>{t("resources.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("resources.email")}</th><th>{t("resources.name")}</th><th>{t("resources.type")}</th><th>{t("resources.capacity")}</th><th>{t("resources.status")}</th></tr></thead>
          <tbody>
            {resources.map(r => (
              <tr key={r.resourceEmailAddress}>
                <td className="font-mono">{r.resourceEmailAddress}</td>
                <td>{r.displayName}</td>
                <td><span className={`badge ${r.type === 'room' ? 'info' : 'warning'}`}>{r.type}</span></td>
                <td>{r.capacity || '-'}</td>
                <td><span className={`badge ${r.state === 'ok' ? 'success' : 'warning'}`}>{r.state}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default ResourcesTab;
