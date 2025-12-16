import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { exchangeService, ExchangeGroup } from "../../../../services/web-cloud.exchange";

interface Props { org: string; service: string; }

export function GroupsTab({ org, service }: Props) {
  const { t } = useTranslation("web-cloud/exchange/index");
  const [groups, setGroups] = useState<ExchangeGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const addresses = await exchangeService.listGroups(org, service);
        const data = await Promise.all(addresses.map(a => exchangeService.getGroup(org, service, a)));
        setGroups(data);
      } finally { setLoading(false); }
    };
    load();
  }, [org, service]);

  if (loading) return <div className="tab-loading"><div className="skeleton-block" /></div>;

  return (
    <div className="groups-tab">
      <div className="tab-header"><h3>{t("groups.title")}</h3></div>
      {groups.length === 0 ? (<div className="empty-state"><p>{t("groups.empty")}</p></div>) : (
        <table className="data-table">
          <thead><tr><th>{t("groups.address")}</th><th>{t("groups.name")}</th><th>{t("groups.members")}</th><th>{t("groups.status")}</th></tr></thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.mailingListAddress}>
                <td className="font-mono">{g.mailingListAddress}</td>
                <td>{g.displayName}</td>
                <td>{g.members?.length || 0}</td>
                <td><span className={`badge ${g.state === 'ok' ? 'success' : 'warning'}`}>{g.state}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default GroupsTab;
